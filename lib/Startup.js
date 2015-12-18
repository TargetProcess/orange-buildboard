Meteor.startup(()=>{
    if (Meteor.isServer) {
        ServiceConfiguration.configurations.upsert(
            {service: 'github'},
            {
                $set: Meteor.settings.github
            }
        );
    }

});

