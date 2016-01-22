let Rx = Npm.require('rx');

_.values(collections).forEach(collection => {
    let events = {
        added: new Rx.Subject(),
        updated: new Rx.Subject(),
        removed: new Rx.Subject()
    };
    collection.collection.find().observe({
        added: function (item) {
            events.added.onNext(item);
        },
        updated: function (item) {
            events.updated.onNext(item);
        },
        removed: function (item) {
            events.removed.onNext(item);
        }
    });

    collection.events = events;
});


//tasks
collections.tasks.events.added
    .subscribe(item => {
        Items.upsert(
            {
                account: item.account,
                id: item.wid
            },
            {
                $push: {tasks: item}
            }
        );
    });
collections.tasks.events.updated
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'tasks.id': item.id
            },
            {$set: {'tasks.$': item}}
        );
    });
collections.tasks.events.removed
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'tasks.id': item.id
            },
            {
                $pull: {tasks: {id: item.id}}
            }
        );
        Items.remove(
            {
                id: item.wid,
                tasks: [],
                branches: []
            }
        );
    });

//branches
collections.branches.events.added
    .subscribe(item => {
        Items.upsert(
            {
                account: item.account,
                id: item.wid
            },
            {
                $push: {'branches': item}
            }
        );
    });
collections.branches.events.updated
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'branches.id': item.id
            },
            {$set: {'branches.$': item}}
        );
    });
collections.branches.events.removed
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'branches.id': item.id
            },
            {
                $pull: {branches: {id: item.id}}
            }
        );
        Items.remove(
            {
                id: item.wid,
                tasks: {
                    $or: [
                        {$exists: false},
                        {$eq: []}
                    ]
                },
                branches: {
                    $or: [
                        {$exists: false},
                        {$eq: []}
                    ]
                }
            }
        );
    });

//pull requests
collections.pullRequests.events.added
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                'branches.id': item.branch
            },
            {
                $set: {
                    'branches.$.pullRequest': item
                }
            }
        );
    });
collections.pullRequests.events.updated
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                'branches.id': item.branch,
                'branches.pullRequest.id': item.id
            },
            {
                $set: {
                    'branches.$.pullRequest': item
                }
            }
        );
    });
collections.pullRequests.events.removed
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                'branches.id': item.branch,
                'branches.pullRequest.id': item.id
            },
            {
                $unset: {
                    'branches.$.pullRequest': ''
                }
            }
        );
    });

//builds
collections.builds.events.added
    .subscribe(item => {
        let query = {
            account: item.account
        };
        if (item.pullRequest) {
            query['branches.pullRequest.id'] = item.pullRequest;
        }
        else {
            query['branches.id'] = item.branch;
        }
        Items.update(query, {
            '$push': {
                builds: {
                    '$each': [item],
                    '$sort': {timestamp: -1}
                }
            }
        });
    });
collections.builds.events.updated
    .subscribe(item => {
        let query = {
            account: item.account
        };
        if (item.pullRequest) {
            query['branches.pullRequest.id'] = item.pullRequest;
        }
        else {
            query['branches.id'] = item.branch;
        }

        Items.update(query,
            {
                $set: {
                    'builds.$': item
                }
            }
        );
    });
collections.builds.events.removed
    .subscribe(item => {
        let query = {
            account: item.account
        };
        if (item.pullRequest) {
            query['branches.pullRequest.id'] = item.pullRequest;
        }
        else {
            query['branches.id'] = item.branch;
        }

        Items.update(
            {
                account: item.account,
                'branches.lastBuild.id': item.id
            },
            {
                $pull: {
                    'builds': {id: 'item.id'}
                }
            }
        )
    });

//jobs
collections.jobs.events.added
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                'builds.id': item.build
            },
            {
                '$push': {
                    'builds.$.jobs': item
                }
            }
        );
    });
//won't work
//collections.jobs.events.updated
//    .subscribe(item => {
//        Items.update(
//            {
//                account: item.account,
//                'builds.id': item.build,
//                'builds.jobs.id': item.id
//            },
//            {
//                '$set': {
//                    'builds.$.jobs.$': item
//                }
//            }
//        );
//    });
collections.jobs.events.removed
    .subscribe(item => {
        Items.update(
            {
                account: item.account,
                'builds.id': item.build,
                'builds.jobs.id': item.id
            },
            {
                $pull: {
                    'builds.$.jobs': {id: item.id}
                }
            }
        );
    });