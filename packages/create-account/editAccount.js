var tools = new ReactiveVar([]);
Template.editAccount.helpers({
    tools() {
        var mergedTools = tools.get();
        if (this.tools) {
            _.each(this.tools, (values, key)=> {
                mergedTools.forEach((t)=>{
                    if(t.type === key) {
                        t.currentValue = values;
                    }
                });
            })
        }
        return mergedTools;
    }
});

Meteor.call('initTools', function (e, ts) {
    tools.set(ts.map((item) => {
        item.reactFields = new ReactiveVar([]);
        return item;
    }));
});
Template.editAccount.events({
    'submit form'(e, t) {
        e.preventDefault();
        var name = t.find('#account-name').value.trim();
        var settingsTools = tools.get().reduce((settingsTools, tool)=> {
            var type = tool.type;
            settingsTools[type] = t.findAll(`.js-${type}`).reduce(function (values, el) {
                values[el.name] = el.value;
                return values
            }, {});
            return settingsTools;
        }, {});


        Meteor.call('saveAccount', this._id, {id: name, tools: settingsTools}, function (err, result) {
            if (err) {
                alert(JSON.stringify(err))
            } else {
                alert('Успех')
            }
        })
    }
});