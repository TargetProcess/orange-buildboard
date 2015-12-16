Meteor.startup(()=> {
    _.mixin({
        get: lodash_get
    });
});