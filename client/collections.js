Meteor.subscribe("userData");

Items = new Meteor.Collection(null);

_.chain(collections)
    .values()
    .filter(collection=>collection.opposite)
    .each(collecion=> {
        var oppositeCollection = collections[collecion.opposite];
        var itemName = collecion.item;
        var oppositeItemName = oppositeCollection.item;
        let itemId = itemName + '.id';
        let oppositeId = oppositeItemName + '.id';

        collecion.collection
            .find({})
            .observe({
                added: bind('added'),
                changed: bind('changed'),
                removed: bind('removed')
            })
    });