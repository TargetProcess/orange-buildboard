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
            item: 'task'
        },
        {
            id: 'branches',
            collection: Branches,
            item: 'branch'
        },
        {
            id: 'pullRequests',
            collection: PullRequests,
            item: 'pullRequest'
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
            item: 'job'
        },
        {
            id: 'artifacts',
            collection: Artifacts,
            item: 'artifact'
        }
    ], 'id');

currentAccountName = ()=> {
    return Session.get('currentAccount');
};
