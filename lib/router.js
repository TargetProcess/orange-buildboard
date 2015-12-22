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

Router.route('accountGetAll', {
        path: '/:id/getAll',
        action() {
            var account = this.params.id;
            Meteor.call('getAll', account, function () {
                Router.go('/' + account + '/tasks');
            });
            this.render('loading');
        }
    }
);

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

Router.route('itemDetail', {
    loadingTemplate: 'loading',
    path: '/:account/items/:id',
    action: function () {
        this.render('ItemView', {
            data: ()=> Items.findOne(this.params.id)
        });
    }
});
Router.route('/:account', function () {
    Router.go('/' + currentAccountName() + '/tasks/');
});

