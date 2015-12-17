Meteor.publish('accounts', function () {
    return BuildBoardAccounts.find({owners:{$in:[this.userId]}});
});
