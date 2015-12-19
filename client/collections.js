Meteor.subscribe("userData");

Items = new Meteor.Collection(null);

_.chain(collections)
    .values()
    .filter(collection=>collection.opposite)
    .each(collection=> {

        let bind = function (actionName) {
            return function (item) {
                _.each(collection.mappings, mapping=> {
                    mapping.bind(mapping, collection, item, actionName, item.account);
                })
            }
        };
        collection.collection
            .find({})
            .observe({
                added: bind('added'),
                changed: bind('changed'),
                removed: bind('removed')
            })
    });