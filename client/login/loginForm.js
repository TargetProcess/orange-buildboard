Template.loginForm.events({
    'click .js-github'() {
        Meteor.loginWithGithub({
            //   requestPermissions: ['user', 'email']
        }, function () {

        });
    },
    'submit form'(e, t) {
        e.preventDefault();

        var email = t.find('#login-email').value;
        var password = t.find('#login-password').value;

        Meteor.loginWithPassword(email, password, function (err) {
            if (err) {
                alert(JSON.stringify(err));
            } else {
                Router.go('/');
            }
        });
        return false;
    }
});