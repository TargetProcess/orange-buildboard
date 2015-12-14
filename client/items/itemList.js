Template.itemList.events({
    'click .js-show-more'(){
        this.handle.loadNextPage();
    }
});
Template.itemList.helpers({
    showLoading() {
        return !this.handle.ready();
    },
    items() {
       return Items.find({}, {limit: this.handle.loaded() - 5});
    },
    showMore(){
        var handle = this.handle;
        return handle.ready() && (Items.find({}, {limit: handle.loaded() - 5}).count() < Items.find({}).count());
    }
});