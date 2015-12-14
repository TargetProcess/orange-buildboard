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
            var tools = _.reduce(settings.tools, function (tools, tool, key) {
                if (tool.toolId === 'None') {
                    return tools;
                }
                tools[key] = {
                    accountToken,
                    toolId: tool.toolId
                };
                var params = {
                    accountToken,
                    config: _.omit(tool, 'toolId')
                };
                createToolAccount(key, tool.toolId, id, params).then(
                    (data)=>{
                        console.log(data)
                    }
                ).catch((err)=>{
                    console.log(err);
                });
                return tools;
            }, {});

            BuildBoardAccounts.update(id, {$set: {id: settings.id, tools: tools}});
            return {res: true};
        }
    },
    initTools() {
        return Meteor.settings.tools;
    }
});

