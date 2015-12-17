var extendName = (item, key)=> {
    return _.extend({name: key}, item);
};

function getDefaultSettings(toolId) {
    var tool = Tool.findToolById(toolId);

    return (tool && tool.defaults) || {};
}


Meteor.methods({
    getToolSettings(tool) {
        check(this.userId, String);
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
        }).catch((e)=> {
            throw new Meteor.Error("getToolSetting", e.join('\n'));
        });
    },
    saveToolSettings(accountId, formData) {
        check(this.userId, String);
        var account = BuildBoardAccounts.findOne({id: accountId});

        return Tool.saveToolSettings({
            toolToken: formData.tool.toolToken,
            settings: formData.settings,
            url: formData.tool.url,
            toolId: formData.tool.id
        }).then(function ({toolToken}) {
            var tools = account.tools || [];
            var index = tools.findIndex(tool=>tool.toolToken === toolToken);
            var isUniqueName = tools.find(tool=> tool.toolToken !== toolToken && tool.name === formData.tool.name);
            if (isUniqueName) {
                return Promise.reject(['Name should be unique within current account']);
            }
            var tool = {
                toolToken,
                name: formData.tool.name,
                id: formData.tool.id,
                resources: formData.resources
            };
            if (index !== -1) {
                tools[index] = tool
            } else {
                tools.push(tool)
            }
            BuildBoardAccounts.update({_id: account._id}, {$set: {tools: tools}});
            return true;
        }).catch((e)=> {
            throw new Meteor.Error("saveAccount", e.join('\n'));
        });
    }
});
