Meteor.subscribe("userData");

Items = new Meteor.Collection(null);


Tasks.find({}).observe({
    added: function (task) {
        var branches = findBranchesForTasks(task.account, [task]);
        branches.forEach(branch=> {
            Items.upsert({
                'task.id': task.id,
                'branch.id': branch.id
            }, {$set: {task, branch}});

            Items.remove({
                "branch.id": branch.id,
                task: {$exists: false}
            });
        });

        if (branches.count() == 0) {
            Items.insert({task});
        }
        else {
            Items.remove({"task.id": task.id, branch: {$exists: false}})
        }
    },
    changed: function (task) {
        Items.update({"task.id": task.id}, {$set: {task}}, {multi: true});
    },
    removed: function (task) {
        Items.remove({
            "task.id": task.id,
            branch: {$exists: false}
        });

        Items.update({"task.id": task.id}, {$unset: {task}})
    }
});
Branches.find({}).observe({
    added: function (branch) {
        var tasks = findTasksForBranches(branch.account, [branch]);
        tasks.forEach(task=> {
            Items.upsert({
                'task.id': task.id,
                'branch.id': branch.id
            }, {$set: {task, branch}});

            Items.remove({
                "task.id": task.id,
                branch: {$exists: false}

            });
        });
        if (tasks.count() == 0) {
            Items.insert({branch});
        }
        else {
            Items.remove({"branch.id": branch.id, task: {$exists: false}})
        }
    },


    updated: function (branch) {
        Items.update({"branch.id": branch.id}, {$set: {branch}}, {multi: true});
    },

    removed: function (branch) {
        Items.remove({
            "branch.id": branch.id,
            task: {$exists: false}
        });

        Items.update({"branch.id": branch.id}, {$unset: {branch}})
    }
});