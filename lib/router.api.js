function end(ctx, status, body) {
    ctx.response.writeHead(status);
    ctx.response.end(JSON.stringify(body))
}

_.each(collections, collection=> {
    Router.route(`:account/api/${collection.id}/:page?`, {where: 'server'})
        .get(function () {

            var account = this.params.account;
            var toolToken = this.params.toolToken;
            if (!toolToken) {
                return end(this, 401, {error: 'Authentication failed'})
            }

            var accountConfig = BuildBoardAccounts.findOne({id: account});
            if (!accountConfig) {
                return end(this, 404, {error: `Account ${account} not found`})
            }


            console.log(accountConfig);




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
        })
        .post(function () {
            var item = this.request.body;


            if (!item || !_.isObject(item)) {
                end(this, 400, {error: `Not a ${collection.item}`});
            } else {
                let requiredVariables = {
                    id: String,
                    name: String,
                    url: String,
                    tool: String
                };
                if (!Match.test(item, requiredVariables)) {
                    return end(this, 400, {
                        error: 'Required fields are missing or have invalid types',
                        pattern: _.mapValues(requiredVariables, 'name')
                    });
                }

                else {
                    end(this, 200, {ok: true});
                }
            }
        });
});
