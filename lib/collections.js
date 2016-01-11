BuildboardUsers = new Mongo.Collection('buildboard_users');

Tasks = new Mongo.Collection('tasks');
Branches = new Mongo.Collection('branches');
PullRequests = new Mongo.Collection('pullRequests');
Builds = new Mongo.Collection('builds');
Jobs = new Mongo.Collection('jobs');
Artifacts = new Mongo.Collection('artifacts');

Items = new Mongo.Collection('items');

collections = _.indexBy(
    [
        {
            id: 'tasks',
            collection: Tasks,
            item: 'task',
            mappings: [
                {
                    id: 'regex_one',
                    destination: 'branches',
                    config: {
                        regex: 'feature\/(?:us|bug)(${placeholder})(_|$)',
                        destField: 'id', //task.id
                        sourceField: 'id', //branch.id
                        placeholder: '${placeholder}'
                    }
                }
            ]
        },
        {
            id: 'branches',
            collection: Branches,
            item: 'branch',
            mappings: [
                {
                    id: 'regex_many',
                    destination: 'tasks',

                    config: {
                        regex: 'feature\/(?:us|bug)(\\d+)(_|$)',
                        destField: 'id', //branch.id
                        sourceField: 'id', // task.id
                        group: 1
                    }
                }
            ]
        },
        {
            id: 'pullRequests',
            collection: PullRequests,
            item: 'pullRequest',
            mappings: [
                {
                    id: 'regex_attach',
                    destination: 'branches',
                    config: {
                        regex: '$branch^',
                        sourceField: 'branch', // pullRequest
                        destField: 'id',
                        placeholder: 'branch'
                    }
                }
            ]
        },
        {
            id: 'users',
            collection: BuildboardUsers,
            item: 'user'
        },
        {
            id: 'builds',
            collection: Builds,
            item: 'build',
            mappings: []
        },
        {
            id: 'jobs',
            collection: Jobs,
            item: 'job',
            mappings: []
        },
        {
            id: 'artifacts',
            collection: Artifacts,
            item: 'artifact',
            mappings: []
        }
    ], 'id');

currentAccountName = ()=> {
    return Session.get('currentAccount');
};
