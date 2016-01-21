function getProperty(object, prop) {
    return object && object[prop] || '';
}

function state(item, prop) {
    return getProperty(first(item.tasks, 'state'), prop);
}

function first(items, prop) {
    return items && items[0] && items[0][prop] || '';
}

function pullRequest(item, prop) {
    return getProperty(first(item.branches, 'pullRequest'), prop);
}

function lastBuild(item, prop) {
    return getProperty(first(item.branches, 'lastBuild'), prop);
}

Template.itemItem.helpers({getProperty, state, first, pullRequest, lastBuild});
Template.itemItem.events({
    'click tr'(){
        Router.go('/' + this.parent.account + '/items/' + this.item._id);
    }
});
