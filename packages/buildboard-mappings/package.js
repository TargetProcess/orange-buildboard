Package.describe({
    name: 'buildboard-mappings',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Mappuing implementations for Buildboard',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use(['underscore']);
    api.addFiles(['lib/buildboard-mappings.js', 'lib/directBindings.js', 'lib/utils.js'], 'server');
    api.export(['mappings', 'applyMappings']);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('buildboard-account');
    api.use('sanjo:jasmine@0.20.3');
    api.addFiles('tests/buildboard-mappings.js');
});
