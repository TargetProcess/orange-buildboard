Template.layout.helpers({
    showArrowBack() {
        return false;// Router.current().route.getName()
    },
    isLogged() {
      return Meteor.userId();
    }
});

Template.layout.events({
    'click .js-arrow-back'() {
        history.back();
    }
});
