Meteor.methods({
    createAccount(name) {
        check(this.userId, String);
        var account = BuildBoardAccounts.findOne({id: name});
        if (account) {
            throw Meteor.Error('Account with this name exists');
        } else {
            var newAccount = {id: name, owners: [this.userId]};
            BuildBoardAccounts.insert(newAccount);
            return newAccount;
        }
    },
    initTools() {
        check(this.userId, String);
        return Meteor.settings.tools;
    }
});

