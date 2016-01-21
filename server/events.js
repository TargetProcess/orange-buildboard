Events.subscribe(({item, modification}) => {
    console.log(item, modification);
});

//tasks
Events
    .filter(({item, modification}) => item.tpe == 'task' && modification == 'added')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'task' && modification == 'updated')
    .subscribe(({item}) => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'tasks.id': item.id
            },
            {$set: {'tasks.$': item}}
        );
    });
Events
    .filter(({item, modification}) => item.tpe == 'task' && modification == 'removed')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'branch' && modification == 'added')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'branch' && modification == 'updated')
    .subscribe(({item}) => {
        Items.update(
            {
                account: item.account,
                id: item.wid,
                'branches.id': item.id
            },
            {$set: {'branches.$': item}}
        );
    });
Events
    .filter(({item, modification}) => item.tpe == 'branch' && modification == 'removed')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'pullRequest' && modification == 'added')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'pullRequest' && modification == 'updated')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'pullRequest' && modification == 'removed')
    .subscribe(({item}) => {
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
Events
    .filter(({item, modification}) => item.tpe == 'build' && modification == 'added')
    .subscribe(({item}) => {
        let query = {
            account: item.account,
            $or: [
                {'branches.lastBuild': {$exists: false}},
                {'branches.lastBuild.timestamp': {$lt: item.timestamp}}
            ]
        };
        if (item.pullRequest) {
            query['branches.pullRequest.id'] = item.pullRequest;
        }
        else{
            query['branches.id'] = item.branch;
        }
        Items.update(query,
            {
                $set: {
                    'branches.$.lastBuild': item
                }
            }
        )
    });
Events
    .filter(({item, modification}) => item.tpe == 'build' && modification == 'updated')
    .subscribe(({item}) => {
        Items.update(
            {
                account: item.account,
                'branches.lastBuild.id': item.id
            },
            {
                $set: {
                    'branches.$.lastBuild': item
                }
            }
        )
    });
Events
    .filter(({item, modification}) => item.tpe == 'build' && modification == 'removed')
    .subscribe(({item}) => {
        Items.update(
            {
                account: item.account,
                'branches.lastBuild.id': item.id
            },
            {
                $unset: {
                    'branches.$.lastBuild': ''
                }
            }
        )
    });