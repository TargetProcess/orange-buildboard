Meteor.startup(()=>{
    if (Meteor.isServer) {
        var accountConfig = Meteor.settings;
        ServiceConfiguration.configurations.upsert(
            { service: "github" },
            {
                $set: accountConfig.github
            }
        );
    }

});

