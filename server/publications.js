Meteor.publish('userData', function () {
    if (this.userId) {
        return Meteor.users.find({_id: this.userId},
            {fields: {services: 1}});
    } else {
        this.ready();
    }
});

Meteor.publish('tasks', function (account, limit, skip) {
    var tasks = Tasks.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});

    var branches = findBranchesForTasks(account, tasks);

    return [tasks, branches];
});

Meteor.publish('branches', function (account, limit, skip) {
    var branches = Branches.find({account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});

    var tasks = findTasksForBranches(account, branches);

    return [branches, tasks];
});

