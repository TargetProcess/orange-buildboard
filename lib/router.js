Router.onBeforeAction(function () {
    if (!Meteor.user() && !Meteor.loggingIn()) {
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
if (Meteor.isClient) {
    Meteor.subscribe("accounts");
}

if (Meteor.isServer) {
    Meteor.methods({
        refresh(account) {
            var config = BuildBoardAccounts.findOne({id: account});
            if (config) {
                var pmTool = new PMTool(config.tools.PMTool);
                var codeTool = new CodeTool(config.tools.CodeTool);
                //var buildTool = new BuildTool(config.tools.BuildTool);

                Tasks.remove({});
                var tasks = pmTool.getTasks();
                _.each(tasks, x=>Tasks.insert(_.extend({account}, x)));


                Branches.remove({});
                var branches = codeTool.getBranches();
                _.each(branches, x=>Branches.insert(_.extend({account}, x)));


                //var builds = buildTool.getBuilds();
                //var items = mapItems(branches, tasks, builds, account);

                //Items.remove({account});
                //items.forEach(i=>Items.insert(i));

                //      this.response.end(JSON.stringify(items));
            }
            else {
                //       this.response.statusCode = 404;
                //     this.response.end(JSON.stringify({status: "404", message: `account "${account}" not found.`}));
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

Router.route('/:account/refresh',
    function () {
        var account = this.params.account;
        Meteor.call('refresh', account, function () {
            Router.go('/' + account)
        });
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


Router.route('/:account/tasks',
    {
        action(){
            "use strict";
            var tasks = Meteor.subscribeWithPagination('tasks', this.params.account, 20);

            this.render('itemList', {
                data: ()=> ({
                    account: this.params.account,
                    handle: tasks
                })
            });
        }
    }
);
Router.route('/:account/branches',
    {
        action(){
            "use strict";
            var tasks = Meteor.subscribeWithPagination('branches', this.params.account, 20);

            this.render('itemList', {
                data: ()=> ({
                    account: this.params.account,
                    handle: tasks
                })
            });
        }
    }
);


Router.route('/:account/edit',
    {
        loadingTemplate: 'loading',
        waitOn: function () {
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


