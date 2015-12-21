Meteor.publish('userData', function () {
    if (this.userId && Meteor.users) {
        return Meteor.users.find({_id: this.userId},
            {fields: {services: 1}});
    } else {
        this.ready();
    }
});

_.each(collections, collection=> {
    Meteor.publish(collection.id, function (account, limit, skip) {
        var items = collection.collection.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});

        return _.map(collection.mappings, mappingConfig=> {
            return findItems({mappingConfig, account, items});
        }).concat([items]);
    });
});