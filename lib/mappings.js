function config({mappingConfig, source, sourceItem}) {
    return {
        sourceField: source.item + '.' + mappingConfig.config.sourceField,
        sourceFieldValue: _.get(sourceItem, mappingConfig.config.sourceField),
        destination: collections[mappingConfig.destination],
        destinationField: collections[mappingConfig.destination].item + '.' + mappingConfig.config.destField,
        destinationFieldValueGetter: (destinationItem)=>_.get(destinationItem, mappingConfig.config.destField)
    };
}
var directBindings = {
    added({mappingConfig, source, sourceItem, account}) {

        var {
            sourceField,
            sourceFieldValue,
            destination,
            destinationField,
            destinationFieldValueGetter
            } = config({mappingConfig, source, sourceItem});

        var destinationItems = findItems({mappingConfig, account, items: [sourceItem]});

        destinationItems.forEach(destinationItem=> {
            let destinationFieldValue = destinationFieldValueGetter(destinationItem);
            Items.upsert({
                    [source.item + '.tool']: sourceItem.tool,
                    [sourceField]: sourceFieldValue,
                    [destinationField]: destinationFieldValue
                },
                {
                    $set: {
                        [source.item]: sourceItem,
                        [destination.item]: destinationItem
                    }
                });

            Items.remove({
                [destinationField]: destinationFieldValue,
                [sourceField]: {$exists: false}
            });
        });

        if (destinationItems.count() == 0) {
            Items.insert({[source.item]: sourceItem});
        } else {
            Items.remove({
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool,
                [destination.item]: {$exists: false}
            });
        }

    },
    changed({mappingConfig, source, sourceItem}){
        var {
            sourceField,
            sourceFieldValue,
            } = config({mappingConfig, source, sourceItem});

        Items.update(
            {
                [source.item + '.tool']: sourceItem.tool,
                [sourceField]: sourceFieldValue
            },
            {
                $set: {
                    [source.item]: sourceItem
                }
            },
            {multi: true});
    },
    removed({mappingConfig, source, sourceItem}){
        var {
            sourceField,
            sourceFieldValue,
            destination
            } = config({mappingConfig, source, sourceItem});

        Items.remove({
            [sourceField]: sourceFieldValue,
            [source.item + '.tool']: sourceItem.tool,
            [destination.item]: {$exists: false}
        });

        Items.update(
            {
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool
            }, {$unset: {[source.item]: sourceItem}}, {multi: true});
    }
};

mappings = _.indexBy([
    {
        id: 'regex_1_direct',
        bind({account, mappingConfig, source, sourceItem, modification}){
            return directBindings[modification]({account, mappingConfig, source, sourceItem});
        },
        map(item, config){
            return {
                [config.sourceField]: {
                    $regex: config.regex.replace(config.placeholder, _.get(item, config.destField)),
                    $options: config.options || 'i'
                }
            };
        }
    },
    {
        id: 'regex_2_direct',
        bind({account, mappingConfig, source, sourceItem, modification}){
            return directBindings[modification]({mappingConfig, source, sourceItem, account});
        },
        map(item, config){
            console.log(item, config);
            let branchRegex = new RegExp(config.regex, config.options || 'ig');
            var result = (branchRegex.exec(_.get(item, config.destField)) || [])[config.group];
            if (!_.isUndefined(result)) {
                return {[config.sourceField]: result};
            }
        }
    }
], 'id');

findItems = function ({mappingConfig, account, items}) {
    let mapping = mappings[mappingConfig.id];

    var $or = _.compact(items.map(item=>mapping.map(item, mappingConfig.config)));
    let destinationCollection = collections[mappingConfig.destination].collection;
    if ($or.length > 0) {
        return destinationCollection.find({
            account,
            $or: $or
        });
    } else {
        return destinationCollection.find({nothing: 1});
    }
};
