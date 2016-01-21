Meteor.methods({
    getAll(accountId) {
        var account = BuildBoardAccounts.findOne({id: accountId});
        if (account) {
            _.each(account.tools, tool => {
                _.each(tool.resources, resource=> {
                    var collection = collections[resource];
                    if (collection) {
                        var items = Tool.getAll(tool, resource);

                        collection.collection.remove({
                            account: accountId,
                            tool: tool.name,
                            id: {$not: {$in: items.map(i=>i.id)}}
                        });

                        _.each(items, item=> {
                            item.tool = tool.name;
                            item.account = account.id;
                            collection.collection.upsert(
                                {
                                    id: item.id,
                                    tool: item.tool,
                                    account: item.account
                                },
                                {$set: item}
                            );
                        });
                    }
                });
            });
        }
    }
});
