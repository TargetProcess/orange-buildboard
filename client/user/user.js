Template.user.helpers({
    userName(){
        var user = Meteor.user();
        if (!user)
            return '';

        if (user.profile && user.profile.name)
            return user.profile.name;
        if (user.username)
            return user.username;
        if (user.emails && user.emails[0] && user.emails[0].address)
            return user.emails[0].address;

        return '';
    },
    avatarURL() {
        if (Meteor.user() && Meteor.user().services && Meteor.user().services.github) {
            return Gravatar.imageUrl(Meteor.user().services.github.email, {
                size: 126,
                default: 'mm'
            });
        } else if (Meteor.user() && Meteor.user().emails) {
            return Gravatar.imageUrl(Meteor.user().emails[0].address, {
                size: 126,
                default: 'mm'
            });
        }
    },
    currentAccountName: currentAccountName
});

Template.user.events({
    'click .js-logout'() {
        Meteor.logout();
    }
});

