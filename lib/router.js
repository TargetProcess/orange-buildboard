if (Meteor.isClient) {
    Session.setDefault('currentAccount', '');
}
Router.onBeforeAction(function () {
    var account = this.params.account;
    if (account) {
        Session.set('currentAccount', account);
    }
    this.next();
});
Router.onBeforeAction(function () {
    if (Meteor.isClient && (!Meteor.user() && !Meteor.loggingIn())) {
        this.redirect('/login');
    } else {
        this.next();
    }
}, {
    except: ['login', 'register']
});

Router.route('/register', function () {
    if (Meteor.user()) {
        this.redirect('/');
    }
    this.layout('login');
    this.render('registerForm');
});

Router.route('/login', function () {
    if (Meteor.user()) {
        this.redirect('/');
    }
    this.layout('login');
    this.render('loginForm');
});

Router.configure({
    layoutTemplate: 'layout'
});

if (Meteor.isServer) {

    Meteor.methods({
        getAll(accountId) {
            var account = BuildBoardAccounts.findOne({id: accountId});
            if (account) {
                var tools = account.tools;

                _.each(tools, tool=> {
                    _.each(tool.resources, resource=> {
                        var items = Tool.getAll(tool, resource);
                        _.each(items, item=> {
                            item.tool = tool.name;
                            item.account = account.id;
                            if (collections[resource]) {
                                collections[resource].collection.upsert(
                                    {
                                        id: item.id,
                                        tool: item.tool,
                                        account: item.account
                                    },
                                    {$set: item}
                                );
                            }
                        });
                    });
                });
            }
        }
    });
}

Router.route('/createAccount', {
    loadingTemplate: 'loading',
    action() {
        this.render('createAccount');
    }
});

Router.route('/:account/getAll',
    function () {
        var account = this.params.account;
        Meteor.call('getAll', account, function () {
            Router.go('/' + account + '/tasks');
        });
        this.render('loading');
    });

Router.route('/', {
    loadingTemplate: 'loading',
    waitOn() {
        return Meteor.subscribe('accounts');
    },
    action() {
        if (BuildBoardAccounts.find().count()) {
            Router.go('/' + BuildBoardAccounts.findOne({}).id + '/tasks');
        } else {
            Router.go('/createAccount');
        }
    }
});

_.each(collections, collection=> {
    Router.route(`/:account/${collection.id}`, {
        action(){
            var items = Meteor.subscribeWithPagination(collection.id, this.params.account, 20);
            this.render('itemList', {
                data: ()=> ({
                    account: this.params.account,
                    handle: items
                })
            });
        }
    });
});

Router.route('/:account/edit',
    {
        loadingTemplate: 'loading',
        waitOn() {
            return Meteor.subscribe('accounts');
        },
        action() {

            this.render('editAccount', {
                data: ()=> BuildBoardAccounts.findOne({id: this.params.account})
            });
        }
    }
);

Router.route('/:account/items/:id',
    {
        loadingTemplate: 'loading',
        action: function () {
            this.render('ItemView', {
                data: ()=> Items.findOne(this.params.id)
            });
        }
    });
Router.route('/:account', function () {
    Router.go('/' + currentAccountName() + '/tasks/');
});

