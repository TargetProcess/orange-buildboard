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
                Router.go('/' + account);
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


Router.route('itemDetail', {
    loadingTemplate: 'loading',
    path: '/:account/items/:id',
    waitOn() {
        return Meteor.subscribe('item', this.params.id);
    },
    action: function () {
        this.render('ItemView', {
            data: ()=> Items.findOne({_id: this.params.id})
        });
    }
});

Router.route('/:account', {
    action(){
        var items = Meteor.subscribeWithPagination('items', this.params.account, 20);
        this.render('itemList', {
            data: ()=> ({
                account: this.params.account,
                handle: items
            })
        });
    }
});

