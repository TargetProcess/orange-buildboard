Template.itemItem.helpers({
    getProperty(object, prop) {
        return object && object[prop] || '';
    },

    first(items, prop) {
        return items && items[0] && items[0][prop] || '';
    }
});
Template.itemItem.events({
    'click tr'(){
        Router.go('/' + this.parent.account + '/items/' + this.item._id);
    }
});
