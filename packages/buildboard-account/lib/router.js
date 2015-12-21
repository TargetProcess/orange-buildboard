Router.route('createAccount', {
    path: '/createAccount',
    loadingTemplate: 'loading',
    action() {
        this.render('createAccount');
    }
});

Router.route('editAccount',
    {
        path: '/:account/edit',
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
