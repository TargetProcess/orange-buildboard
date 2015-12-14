Template.layout.helpers({
    showArrowBack() {
        return false;// Router.current().route.getName()
    }
});

Template.layout.events({
    'click .js-arrow-back'() {
        history.back();
    }
});
