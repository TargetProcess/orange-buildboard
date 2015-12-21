Template.accountItem.helpers({
    isOwner() {
       return this.owners.indexOf(Meteor.userId()) !== -1;
   }
});

