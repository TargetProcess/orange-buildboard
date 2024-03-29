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
            config: getDefaultSettings(tool.id),
            resources: []
        };

        if (tool.toolToken) {
            currentSettings = Tool.getToolSettings(tool).then((settings)=> {
                settings.resources = tool.resources || [];
                return settings;
            });
        }

        return Promise.all([Tool.getMetaSettings(tool), currentSettings]).then(([metaSettings, currentSettings])=> {
            var parameterlessMethods = _.chain(metaSettings.methods)
                //only allow parameterless methods
                .map((resource, key)=> {
                    let keysValues = _.pairs(resource);
                    let parameterlessMethods = keysValues.filter(([method, action]) => {
                        return !action.params || !_.some(action.params, p => p.required);
                    });
                    let actualResource = _.object(parameterlessMethods);

                    return _.extend({
                        name: key,
                        currentValue: currentSettings.resources.indexOf(key) !== -1
                    }, actualResource);
                })
                .filter(resource => _.keys(resource).length > 1)
                .value();

            return {
                settings: _.map(metaSettings.settings, (setting, key)=> {
                    var currentValue = currentSettings.config[key];
                    if (_.isUndefined(currentValue)){
                        currentValue = setting.defaultValue;
                    }
                    return _.extend({name: key, currentValue}, setting);
                }),
                methods: parameterlessMethods
            };
        }).catch((e)=> {
            throw new Meteor.Error('getToolSetting', e.join('\n'));
        });
    },
    saveToolSettings(accountId, formData) {
        check(this.userId, String);
        var account = BuildBoardAccounts.findOne({id: accountId});

        return Tool.saveToolSettings({
            toolToken: formData.tool.toolToken,
            settings: formData.settings,
            toolId: formData.tool.id,
            url: formData.tool.url,
            resources: formData.resources
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
                tools[index] = tool;
            } else {
                tools.push(tool);
            }
            BuildBoardAccounts.update({_id: account._id}, {$set: {tools: tools}});
            return true;
        }).catch((e)=> {
            throw new Meteor.Error('saveAccount', e.join('\n'));
        });
    }
});
