var toolSet = new ReactiveVar([]);
Meteor.call('initTools', function (e, ts) {
    toolSet.set(ts);
});

Template.editAccount.helpers({
    tools() {
        return _.map(this.tools, (tool)=> {
            return {currentValue: tool, tools: toolSet.get(), id: this.id, reactToolData: new ReactiveVar({})};
        }).concat({tools: toolSet.get(), id: this.id, reactToolData: new ReactiveVar({})});
    },
    error() {
        return Session.get('accountPage');
    }
});
