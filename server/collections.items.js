_.chain(collections)
    .values()
    .each(source=> {
        let bind = function (modification) {
            return function (sourceItem) {
                _.each(source.mappings, mappingConfig=> {

                    var mapping = mappings[mappingConfig.id];
                    mapping.bind({
                        account: sourceItem.account,
                        mappingConfig,
                        source: source,
                        sourceItem,
                        modification
                    });
                });
            };
        };

        source.collection
            .find({})
            .observe({
                added: bind('added'),
                changed: bind('changed'),
                removed: bind('removed')
            });
    });