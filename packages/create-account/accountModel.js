Meteor.methods({
    createAccount(name) {
        var account = BuildBoardAccounts.findOne({id: name});
        if (account) {
            throw Meteor.Error('Account with this name exists');
        } else {
            BuildBoardAccounts.insert({id: name});
            return {id: name};
        }
    },
    saveAccount(id, settings) {
        var account = BuildBoardAccounts.findOne({id: settings.id});
        var accountToken = id;
        if (account && account._id !== id) {
            throw Meteor.Error('Account with this name exists');
        } else {
            var tools = _.chain(settings.tools).map((tool, key)=> {
                tool.type = key;
                return tool;
            }).reject((tool)=> {
                return tool.toolId === 'None' || _.isEmpty(_.omit(tool, 'toolId', 'type'));
            }).map((tool) => {
                var tools = account.tools || {};
                tools[tool.type] = {
                    accountToken,
                    toolId: tool.toolId
                };
                var params = {
                    accountToken,
                    config: _.omit(tool, 'toolId', 'type')
                };
                return createToolAccount(tool.type, tool.toolId, id, params).then(()=> {
                    BuildBoardAccounts.update(id, {$set: {id: settings.id, tools: tools}});
                }).catch((e)=> {
                    return {error: e.response.data};
                });
            }).value();
            return Promise.all(tools).then((results)=> {
                return results;
            });
        }
    },
    initTools() {
        return Meteor.settings.tools;
    }
});

