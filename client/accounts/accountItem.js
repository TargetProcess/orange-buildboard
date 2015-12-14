Template.accountItem.events({
    click() {
        Router.go('/' + this.id);
    }
});

