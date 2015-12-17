BuildBoardAccounts = new Mongo.Collection('accounts');
if (Meteor.isClient) {
    Meteor.subscribe('accounts');
}

