Meteor.methods({
    getAll(accountId) {
        var account = BuildBoardAccounts.findOne({id: accountId});
        if (account) {
            var tools = account.tools;
            Items.remove({account: accountId});
            _.each(tools, tool => {
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
            _.each(collections, collection=> {
                collection.collection
                    .find({account: accountId})
                    .forEach(item => {
                        item.tpe = collection.item;
                        notify({item, modification: 'added'});
                    });
            });
        }
    }
});
