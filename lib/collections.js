BuildBoardAccounts = new Mongo.Collection('accounts');
Items = new Mongo.Collection('items');

currentAccountName = ()=> {
    return Router.current().params.account;
};
if (Meteor.isServer) {

    Meteor.publish("items", function (account, limit, skip) {
        return Items.find({account: account}, {skip: parseInt(skip) || 0, limit: parseInt(limit) || 10});
    });
    Meteor.publish("userData", function () {
        if (this.userId) {
            return Meteor.users.find({_id: this.userId},
                {fields: {'services': 1}});
        } else {
            this.ready();
        }
    });

    Meteor.publish('item', function (account, id) {

        return Items.find({account: account, _id: id});
    });

    Meteor.publish('accounts', function () {
        return BuildBoardAccounts.find();
    })
}
if(Meteor.isClient) {
    Meteor.subscribe("userData");
}

function getTaskIdFromBranch(branch) {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    return (branchRegex.exec(branch.name) || [])[1];
}
mapItems = (branches, tasks, builds, account) => {

    let tasksById = _.indexBy(tasks, 'id');
    let buildsBySha = _.indexBy(builds, 'sha');


    var results = [];
    for (let i = 0, branchLength = branches.length; i < branchLength; i++) {
        let branch = branches[i];
        let item;
        let taskId = getTaskIdFromBranch(branches[i]);
        if (taskId) {
            let task = tasksById[taskId];
            if (task) {
                item = {account, task, branch};
                tasksById[taskId] = undefined;
                console.log(`mapped: ${task.id} = ${branch.id}`)
            }
            else {
                item = {account, branch};
            }
        }
        else {
            item = {account, branch};
        }

        var branchBuild = buildsBySha[branch.sha];
        branch.builds = _.compact([branchBuild]);

        _.each(branch.pullRequests, pr=> {
            var prBuild = buildsBySha[pr.sha];
            pr.builds = _.compact([prBuild]);
        });

        results.push(item);
    }
    for (let j = 0, tasksLength = tasks.length; j < tasksLength; j++) {
        let task = tasks[j];
        if (tasksById[task.id]) {
            results.push({account, task});
        }
    }

    return results;

};

