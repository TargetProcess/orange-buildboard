var handleSettings = (t)=>(err, res)=> {
    if (err) {
        alert(err.reason);
    } else {
        t.data.reactToolData.set(res);
    }

};
Template.toolItem.events({
    'change .js-tool'(e, t) {
        t.data.reactToolData.set({});
        if (e.target.value !== 'None') {
            Meteor.call('getToolSettings', {id: e.target.value}, handleSettings(t));
        }
    },
    'click .js-edit'(e, t) {
        t.data.reactToolData.set({});
        Meteor.call('getToolSettings', t.data.currentValue, handleSettings(t));
    },
    'submit form'(e, t) {
        e.preventDefault();
        var toolData = t.data.reactToolData.get();
        if (!toolData.settings) {
            return;
        }
        var formData = {
            settings: {},
            resources: toolData.methods.map((method)=>method.name.replace('/', '')), //TODO make ui form for it
            tool: {}
        };

        formData.settings = t.findAll('.js-setting').reduce(function (values, el) {
            values[el.name] = el.value;
            return values
        }, {});
        formData.tool = t.findAll('.js-tool-field').reduce(function (values, el) {
            values[el.name] = el.value;
            return values
        }, {});

        Meteor.call('saveToolSettings', t.data.id,
            formData
            , (err, res)=> {
                if (err) {
                    alert(err.reason);
                }
            });
    }
});

Template.toolItem.helpers({
    settings() {
        return this.reactToolData.get().settings;
    },
    isRequire() {
        return !this.optional;
    },
    showSave() {
        return this.reactToolData.get().settings
    }
});
