Meteor.subscribe("userData");

Items = new Meteor.Collection(null);


Tasks.find({}).observe({
    added: function (task) {
        Items.upsert({"task.id": task.id}, {$set: {task}}, {multi: true});
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
        Items.upsert({"branch.id": branch.id}, {$set: {branch}}, {multi: true});
    },
    changed: function (branch) {
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