Template.itemItem.helpers({
    getProperty(object, prop) {
        return object && object[prop] || '';
    }
});
Template.itemItem.events({
    'click tr'(){
        Router.go('/' + this.parent.account + '/items/' + this.item._id);
    }
});
