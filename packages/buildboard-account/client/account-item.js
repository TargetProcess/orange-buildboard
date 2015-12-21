Template.accountItem.helpers({
    isOwner() {
        return this.owners.indexOf(Meteor.userId()) !== -1;
    },
    account() {
        return {account: this.id};
    }
});
