Template.accountList.helpers({
    accounts() {
        return BuildBoardAccounts.find({});
    }
});

Template.accountList.events({
    'click .js-create-account'() {
       Router.go('/createAccount');
    }
});
