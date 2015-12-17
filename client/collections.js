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
                added: function (item) {
                    var opposites = collecion.mapToOpposite(item.account, [item]);
                    opposites.forEach(opposite=> {

                        Items.upsert({
                            [itemId]: item.id,
                            [oppositeId]: opposite.id
                        }, {$set: {[itemName]: item, [oppositeItemName]: opposite}});

                        Items.remove({
                            [oppositeId]: opposite.id,
                            [itemName]: {$exists: false}
                        });
                    });

                    if (opposites.count() == 0) {
                        Items.insert({[itemName]: item});
                    }
                    else {
                        Items.remove({
                            [itemId]: item.id,
                            [oppositeItemName]: {$exists: false}
                        })
                    }
                },
                changed: function (item) {
                    Items.update({[itemId]: item.id}, {$set: {[itemName]: item}}, {multi: true});
                },
                removed: function (item) {
                    Items.remove({
                        [itemId]: item.id,
                        [oppositeItemName]: {$exists: false}
                    });

                    Items.update({[itemId]: item.id}, {$unset: {[itemName]: item}}, {multi: true})
                }
            })
    });