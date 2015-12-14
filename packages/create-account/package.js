Package.describe({
    name: 'create-account',
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
    api.use(['templating', 'reactive-var', 'iron:router'], 'client');
    api.versionsFrom('1.2.1');
    api.use(['ecmascript', 'underscore','session']);
    api.addFiles([
        'createAccount.html',  'editAccount.html', 'toolSettings.html', 'toolSettings.js', 'create-account.js','editAccount.js'
    ], 'client');
    api.addFiles(['settingsModel.js', 'accountModel.js'], 'server');
    api.use('less');
    api.addFiles('create-account.less');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('create-account');
    api.addFiles('create-account-tests.js');
});
