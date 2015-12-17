let onBeforeAction = function () {
    this.end = (status, body)=> {
        this.response.writeHead(status);
        this.response.end(JSON.stringify(_.isString(body) ? {error: body} : body));
    };


    // var account = this.accountConfig.id;
    var toolToken = this.params.toolToken;
    if (!toolToken) {
        return this.end(401, 'Authentication failed')
    }

    this.accountConfig = BuildBoardAccounts.findOne({tools: {$elemMatch: {toolToken}}});
    if (!this.accountConfig) {
        return this.end(404, `Account '${account}' not found`)
    }

    this.toolConfig = _.find(this.accountConfig.tools, tool=>tool.toolToken == toolToken);

    if (!this.toolConfig) {
        return this.end(403, `There is no tool in account ${account} with token ${toolToken}`);
    }
    this.next();
};

let get = function (collection) {
    return function () {
        var account = this.accountConfig.id;

        var page = (this.params.query.page || 1);

        var limit = Math.min(this.params.query.per_page || 20, 100);
        var skip = (page - 1) * limit;
        let selector = {account};
        if (!this.params.query.all) {
            selector.tool = this.toolConfig.name;
        }

        var items = collection.collection.find(selector, {
            limit: limit + 1,
            skip,
            fields: {_id: 0, account: 0, tool: 0}
        }).fetch();
        var next;
        if (items.length > limit) {
            this.params.query.page = page + 1;
            next = this.route.url({account, toolToken: this.params.toolToken}, {query: this.params.query});
        }

        this.response.setHeader('Content-Type', 'application/json');
        this.response.end(JSON.stringify({
            [collection.id]: _.take(items, limit),
            next
        }));
    }
};
function post(collection) {
    return function () {
        var item = this.request.body;
        if (!item || !_.isObject(item)) {
            return this.end(400, `Not a ${collection.item}`)
        }

        let requiredVariables = {
            id: String,
            name: String,
            url: String
        };

        if (!Match.test(_.pick(item, _.keys(requiredVariables)), requiredVariables)) {
            return this.end(400, {
                error: 'Required fields are missing or have invalid types',
                pattern: _.mapValues(requiredVariables, 'name')
            });
        }

        item.tool = this.toolConfig.name;
        item.account = this.accountConfig.id;

        var result = collection.collection.upsert({
            id: item.id,
            account: item.account,
            tool: item.tool
        }, {$set: item});


        this.end(result.insertedId ? 201 : 200, {id: item.id});
    }
}
function getSingle(collection) {
    return function () {
        var item = collection.collection.findOne({
            account: this.accountConfig.id,
            tool: this.toolConfig.name,
            id: this.params.id
        }, {fields: {_id: 0, account: 0, tool: 0}});
        if (item) {
            this.end(200, item)
        }
        else {
            this.end(404, `Item with id:${this.params.id} not found`)
        }
    }
}
function deleteSingle(collection) {
    return function () {
        var item = collection.collection.remove({
            account: this.accountConfig.id,
            tool: this.toolConfig.name,
            id: this.params.id
        });
        if (item) {
            this.end(200, {id: this.params.id})
        }
        else {
            this.end(404, `Item with id:${this.params.id} not found`)
        }
    }
}

_.each(collections, collection=> {

    Router.route(`api/${collection.id}/:toolToken`,
        {
            where: 'server',
            onBeforeAction
        })
        .get(get(collection))
        .post(post(collection));

    Router.route(`api/${collection.id}/:toolToken/:id`,
        {
            where: 'server',
            onBeforeAction
        })
        .get(getSingle(collection))
        .delete(deleteSingle(collection))


});
