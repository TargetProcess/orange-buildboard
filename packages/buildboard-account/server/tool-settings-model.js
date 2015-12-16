var extendName = (item, key)=> {
    return _.extend({name: key}, item);
};

function getDefaultSettings(toolId) {
    var tool = Tool.findToolById(toolId);

    return (tool && tool.defaults) || {};
}

Meteor.methods({
    getToolSettings(tool) {
        var currentSettings = {
            config: getDefaultSettings(tool.id)
        };

        if (tool.toolToken) {
            currentSettings = Tool.getToolSettings(tool);
        }

        return Promise.all([Tool.getMetaSettings(tool), currentSettings]).then(([metaSettings, currentSettings])=> {
            return {
                settings: _.map(metaSettings.settings, (setting, key)=> {
                    return _.extend({name: key, currentValue: currentSettings.config[key]}, setting)
                }),
                methods: _.map(metaSettings.methods, extendName)
            };
        })
    },
    saveToolSettings(accountId, formData) {
        var account = BuildBoardAccounts.findOne({id: accountId});

        return Tool.saveToolSettings({
            toolToken: formData.settings.toolToken,
            settings: formData.settings,
            url: formData.tool.url,
            toolId: formData.tool.id
        }).then(function ({toolToken}) {
            var tools = account.tools || [];
            if (!tools.find(tool=>tool.toolToken === toolToken)) {
                tools.push({
                    toolToken,
                    id: formData.tool.id,
                    resources: formData.resources
                })
            }
            BuildBoardAccounts.update({_id: account._id}, {$set: {tools: tools}});
            return true;
        }).catch((e)=> {
            throw Meteor.Error(JSON.stringify(e));
        });
    }
});