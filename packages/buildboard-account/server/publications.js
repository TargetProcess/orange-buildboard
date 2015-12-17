Meteor.publish('accounts', function () {
    var user = Meteor.users.findOne({_id: this.userId});
    var github = user.services && user.services.github && user.services.github.email;
    var password = user.emails && user.emails[0].address;
    var emails = _.compact([password, github]);
    var accounts = BuildboardUsers.find({email: {$in: emails}}).map((user)=> {
        return user.account;
    });
    return BuildBoardAccounts.find({
        $or: [
            {
                owners: {
                    $in: [this.userId]
                }
            },
            {
                id: {
                    $in: accounts
                }
            }
        ]
    });
});
