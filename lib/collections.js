Tasks = new Mongo.Collection('tasks');
Branches = new Mongo.Collection('branches');
PullRequests = new Mongo.Collection('pullRequests');
BuildboardUsers = new Mongo.Collection('buildboard_users');

collections = _.indexBy(
    [
        {
            id: 'tasks',
            collection: Tasks,
            item: 'task',
            mappings: [
                {
                    id: 'regex_1_direct',
                    destination: 'branches',
                    config: {
                        regex: 'feature\/(?:us|bug)(${placeholder})',
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
                    id: 'regex_2_direct',
                    destination: 'tasks',

                    config: {
                        regex: 'feature\/(?:us|bug)(\d+)\w*',
                        destField: 'id', //branch.id
                        sourceField: 'id', // task.id
                        group: 1
                    }
                }
            ]
        }
        /*
        {
            id: 'pullRequests',
            collection: PullRequests,
            item: 'pullRequest',
            mappings: [{
                type: 'id',
                destination: 'branches',
                config: {}
            }]
        },
        {
            id: 'users',
            collection: BuildboardUsers,
            item: 'user'
        }
         */]
    , 'id');


currentAccountName = ()=> {
    return Session.get('currentAccount');
};
