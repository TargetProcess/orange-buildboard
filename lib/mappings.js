function config(mapping, source, sourceItem) {
    return {
        sourceField: source.item + '.' + mapping.config.sourceField,
        sourceFieldValue: get(sourceItem, mapping.config.sourceField),
        destination: collections[mapping.destination],
        destinationField: collections[mapping.destination].item + '.' + mapping.config.destField,
        destinationFieldValueGetter: (destinationItem)=>get(destinationItem, mapping.config.destField)
    };
}
var directBindings = {
    added(mapping, source, sourceItem, account) {
        var {
            sourceField,
            sourceFieldValue,
            destination,
            destinationField,
            destinationFieldValueGetter
            } = config(mapping, source, sourceItem);


        var destinationItems = findItems(mapping, account);

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
        }
        else {
            Items.remove({
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool,
                [destination.item]: {$exists: false}
            })
        }

    },
    changed(mapping, source, sourceItem){
        var {
            sourceField,
            sourceFieldValue,
            } = config(mapping, source, sourceItem);

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
    removed(mapping, source, sourceItem){
        var {
            sourceField,
            sourceFieldValue,
            destination
            } = config(mapping, source, sourceItem);

        Items.remove({
            [sourceField]: sourceFieldValue,
            [source.item + '.tool']: sourceItem.tool,
            [destination.item]: {$exists: false}
        });

        Items.update(
            {
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool
            }, {$unset: {[source.item]: sourceItem}}, {multi: true})
    }
};

mappings = _.indexBy([
    {
        id: 'regex_1_direct',
        bind(account, mapping, source, sourceItem, modification){
            return directBindings[modification](account, mapping, source, sourceItem);
        },
        map(item, config){
            return {
                [config.sourceField]: {
                    $regex: config.regex.replace(config.placeholder, _.get(item, config.destField)),
                    $options: config.options || 'i'
                }
            }
        }
    },
    {
        id: 'regex_2_direct',
        bind(account, mapping, source, sourceItem, modification){
            return directBindings[modification](account, mapping, source, sourceItem);
        },
        map(item, config){

            let branchRegex = new RegExp(config.regex, config.options || 'ig');
            var result = (branchRegex.exec(get(item, config.destField)) || [])[config.group];
            if (!_.isUndefined(result)) {
                return {[config.sourceField]: result};
            }
        }
    }
], 'id');

findItems = function (mapping, account, sourceItems) {
    var $or = _.compact(sourceItems.map(item=>mappings[mapping.id].map(item, mapping.config)));
    if ($or.length > 0) {
        return collections[mapping.destination].collection.find({
            account,
            $or: $or
        });
    }
    else {
        return collections[mapping.destination].collection.find({'nothing': 1});
    }
};
