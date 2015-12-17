BuildBoardAccounts = new Mongo.Collection('accounts');
Tasks = new Mongo.Collection('tasks');
Branches = new Mongo.Collection('branches');

currentAccountName = ()=> {
    return Router.current().params.account;
};


var mapTaskToBranch = function (task) {
    return {id: {$regex: `feature\/(?:us|bug)(${task.id})`, $options: 'i'}}
};

var mapBranchToTask = function (branch) {
    let branchRegex = /feature\/(?:us|bug)(\d+)\w*/ig;
    var id = (branchRegex.exec(branch.id) || [])[1];
    if (!_.isUndefined(id)) {
        return {id}
    }
};

findBranchesForTasks = function (account, tasks) {
    var $or = _.compact(tasks.map(mapTaskToBranch));
    if ($or.length > 0) {
        return Branches.find({
            account,
            $or: $or
        });
    }
    else {
        return Branches.find({'nothing': 1});
    }

};

findTasksForBranches = function (account, branches) {

    var $or = _.compact(branches.map(mapBranchToTask));
    if ($or.length > 0) {
        return Tasks.find({
            account,
            $or: $or
        });
    } else {
        return Tasks.find({'nothing': 1});
    }
};

collections = _.indexBy(
    [
        {
            id: 'tasks',
            collection: Tasks,
            item: 'task',
            opposite: 'branches',
            mapToOpposite: findBranchesForTasks
        },
        {
            id: 'branches',
            collection: Branches,
            item: 'branch',
            opposite: 'tasks',
            mapToOpposite: findTasksForBranches
        }
    ]
    , 'id');
