Template.createAccount.events({
    'submit form'(e, t) {
        e.preventDefault();
        var name = t.find('#account-name').value.trim();
        Meteor.call('createAccount', name, function (err, result) {
            if (err) {
                alert(JSON.stringify(err));
            } else {
                Router.go('/' + result.id + '/edit');
            }
        });
    }
});