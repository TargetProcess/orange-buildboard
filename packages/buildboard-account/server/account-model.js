Meteor.methods({
    createAccount(name) {
        var account = BuildBoardAccounts.findOne({id: name});
        if (account) {
            throw Meteor.Error('Account with this name exists');
        } else {
            BuildBoardAccounts.insert({id: name});
            return {id: name};
        }
    },
    initTools() {
        return Meteor.settings.tools;
    }
});

