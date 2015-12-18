sampleData = [
    {
        branch: {
            branchId: 'feature/us2_simple',
            name: 'feature/us2_simple',
            sha: '65d85ffd7938d99e12ee42f5c0621406109bddf5',
            pullRequests: [
                {
                    id: 2,
                    status: 'open',
                    sha: '8024adab83d401d80f2ec355435a3c3ac93aa8fb',
                    builds: [
                        {
                            buildId: 94351019,
                            started: '2015-12-02T08:50:46Z',
                            duration: 13,
                            sha: '8024adab83d401d80f2ec355435a3c3ac93aa8fb',
                            pullRequest: 2,
                            branch: 'feature/us3_test',
                            status: 'passed'
                        }
                    ]
                },
                {
                    id: 1,
                    status: 'open',
                    sha: '525942c3e94ddf80a41a6af097fda47473e75cc4',
                    builds: []
                }
            ],
            builds: [
                {
                    buildId: 94351017,
                    started: '2015-12-02T08:50:45Z',
                    duration: 13,
                    sha: '65d85ffd7938d99e12ee42f5c0621406109bddf5',
                    pullRequest: null,
                    branch: 'feature/us2_simple',
                    status: 'passed'
                }
            ]
        },
        task: {
            id: 2,
            type: 'UserStory',
            name: 'Get data from TP',
            state: {
                id: 78,
                name: 'Open'
            }
        }
    },
    {
        branch: {
            branchId: 'feature/us3_test',
            name: 'feature/us3_test',
            sha: 'a5a5a60955b885714db30374645c2dfede9d1e88',
            pullRequests: [],
            builds: []
        }
    },
    {
        branch: {
            branchId: 'master',
            name: 'master',
            sha: '4f6ee3fef8e3faa906b42c87a7de8fcdd94d7d5e',
            pullRequests: [],
            builds: []
        }
    }
];

sampleAccount = {
    id: 'buildboard',
    token: 'buildboardtoken',
    tools: {
        pm: {
            url: 'http://localhost:3333'
        },
        code: {
            url: 'http://localhost:3334'
        },
        build: {
            url: 'http://localhost:3335'
        }
    },
    users: [],
    mappings: {
        items: [],
        users: []
    }
};