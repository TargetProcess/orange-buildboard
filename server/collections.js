Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
            {fields: {'services': 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('accounts', function () {
    return BuildBoardAccounts.find();
});


Meteor.publish("tasks", function (account, limit, skip) {
    var tasks = Tasks.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});
    var taskIds = tasks.map(x=>x.id);

    var branches = Branches.find({
        account,
        $or: _.map(taskIds, id=>({id: {$regex: `feature\/(?:us|bug)(${id})`, $options: 'i'}}))

    });

    return [tasks, branches];
});

Meteor.publish("branches", function (account, limit, skip) {
    var branches = Branches.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});
    var branchIds = branches.map(x=>x.id);

    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;

    var tasks = Tasks.find({
        account,
        $or: _.chain(branchIds)
            .map(id=>(branchRegex.exec(id) || [])[1])
            .compact()
            .map(id=>({id: parseInt(id)}))
            .value()
    });

    return [branches, tasks];
});



