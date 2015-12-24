Meteor.publish('userData', function () {
    if (this.userId && Meteor.users) {
        return Meteor.users.find({_id: this.userId},
            {fields: {services: 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('items', function (account, limit, skip) {
    return Items.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});
});

Meteor.publish('item', function (id) {
    return Items.find(id);
});