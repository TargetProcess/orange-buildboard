Package.describe({
    name: 'buildboard-account',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.use(['templating', 'reactive-var'], 'client');
    api.use(['ecmascript', 'underscore', 'session', 'mongo', 'check', 'iron:router']);

    api.versionsFrom('1.2.1');

    api.addFiles(['lib/collections.js', 'lib/router.js'], ['client', 'server']);

    api.addFiles([
        'client/create-account.html',
        'client/edit-account.html',
        'client/account-item.html',
        'client/account-list.html',
        'client/tools/tool-item.html',
        'client/tools/text-field.html',
        'client/tools/multiple-selection-field.html',
        'client/tools/tool-item.js',
        'client/create-account.js',
        'client/edit-account.js',
        'client/account-item.js',
        'client/account-list.js',
        'client/tools/multiple-selection-field.js'
    ], 'client');

    api.addFiles([
        'server/tool-settings-model.js',
        'server/account-model.js',
        'server/publications.js'
    ], 'server');

    api.use('less');
    api.addFiles(['client/less/create-account.less', 'client/tools/tool-item.less'], 'client');

    api.export('BuildBoardAccounts');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('buildboard-account');
    api.use('sanjo:jasmine@0.20.3');
    api.addFiles('tests/buildboard-account.js');
});
