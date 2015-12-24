function regexPlaceholderMap(sourceItem, config) {
    let sourceFieldValue = _.get(sourceItem, config.sourceField);
    if (_.isUndefined(sourceFieldValue)) {
        return {};
    } else {
        return {
            [config.destField]: {
                $regex: config.regex.replace(config.placeholder, _.escapeStringRegexp(sourceFieldValue.toString())),
                $options: config.options || 'i'
            }
        };
    }
}

mappings = _.indexBy([
    {
        id: 'regex_one',
        bind({account, mappingConfig, source, sourceItem, modification}){
            return directBindings[modification]({account, mappingConfig, source, sourceItem});
        },
        map: regexPlaceholderMap
    },
    {
        id: 'regex_many',
        bind({account, mappingConfig, source, sourceItem, modification}){
            return directBindings[modification]({mappingConfig, source, sourceItem, account});
        },
        map(item, config){
            let branchRegex = new RegExp(config.regex, config.options || 'ig');
            var result = (branchRegex.exec(_.get(item, config.destField)) || [])[config.group];
            if (!_.isUndefined(result)) {
                return {[config.sourceField]: result};
            }
        }
    },
    {
        id: 'regex_attach',
        bind({account, mappingConfig, source, sourceItem, modification}){
            // console.log({account, mappingConfig, source, sourceItem, modification});
        },
        map: regexPlaceholderMap
    }
], 'id');

applyMappings = function ({account, collections}) {
    _.each(collections, collection=> {
        collection.collection.find({account}).forEach(item=> {
            _.each(collection.mappings, mappingConfig=> {
                var mapping = mappings[mappingConfig.id];
                mapping.bind({account, mappingConfig, source: collection, sourceItem: item, modification: 'added'});
            });
        });
    });
};

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
