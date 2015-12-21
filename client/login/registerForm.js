Template.registerForm.events({
    'submit form'(e, t) {
        e.preventDefault();

        var email = t.find('#login-email').value;
        var password = t.find('#login-password').value;
        Accounts.createUser({email: email, password: password}, function (err) {
            if (err) {
                alert(JSON.stringify(err));
            } else {
                Router.go('/');
            }

        });
        return false;
    }
});