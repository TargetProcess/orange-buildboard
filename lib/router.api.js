let onBeforeAction = function () {
    this.end = (status, body)=> {
        this.response.writeHead(status);
        this.response.end(JSON.stringify(_.isString(body) ? {error: body} : body));
    };


    var account = this.params.account;
    var toolToken = this.params.query.toolToken;
    if (!toolToken) {
        return this.end(401, 'Authentication failed')
    }

    this.accountConfig = BuildBoardAccounts.findOne({id: account});
    if (!this.accounConfig) {
        return this.end(404, `Account ${account} not found`)
    }

    this.toolConfig = _.find(this.accountConfig.tools, tool=>tool.toolToken == toolToken);

    if (!this.toolConfig) {
        return this.end(403, `There is no tool in account ${account} with token ${toolToken}`);
    }
    this.next();
};

let get = function (collection) {
    return function () {
        var account = this.params.account;

        var page = (this.params.page || 1);

        var limit = Math.min(this.params.query.per_page || 20, 100);
        var skip = (page - 1) * limit;
        var items = collection.collection.find({account}, {
            limit: limit + 1,
            skip,
            fields: {_id: 0, account: 0}
        }).fetch();
        var next;
        if (items.length > limit) {
            next = this.route.url({account, page: page + 1}, {query: this.params.query});
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify({
            [collection.id]: _.take(items, limit),
            next
        }));
    }
};
let post = function (collection) {
    return function () {
        var item = this.request.body;
        if (!item || !_.isObject(item)) {
            return this.end(400, `Not a ${collection.item}`)
        }

        let requiredVariables = {
            id: String,
            name: String,
            url: String,
            tool: String
        };

        if (!Match.test(item, requiredVariables)) {
            return this.end(400, {
                error: 'Required fields are missing or have invalid types',
                pattern: _.mapValues(requiredVariables, 'name')
            });
        }
        if (item.tool != this.toolConfig.name) {
            return this.end(400, 'Invalid tool name');
        }
        item.account = this.params.account;
        var result = collection.collection.upsert({
            id: item.id,
            account: item.account,
            tool: item.tool
        }, {$set: item});

        this.end(result.insertedId ? 201 : 200, {ok: true});
    }
};

_.each(collections, collection=> {

    Router.route(`:account/api/${collection.id}/:page?`,
        {
            name: collection.id,
            where: 'server',
            onBeforeAction: onBeforeAction
        })
        .get(get(collection))
        .post(post(collection));
});
