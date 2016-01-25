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
            resources: [],
            tool: {}
        };

        let settings = t.findAll('.js-setting');
        let settingsMetadata = this.reactToolData.get().settings;

        function getSettingsValue(type, elements) {
            switch (type) {
                case 'multiple selection':
                    return elements.filter(el => el.checked).map(el => el.value);
                case 'list':
                    return elements[0].value.split(',')
                        .map(i => i.trim())
                        .filter(i => i);
                default:
                    return elements[0].value;
            }
        }

        formData.settings = _.chain(settings)
            .groupBy(el => el.name)
            .reduce(function (values, els, key) {
                let metadata = settingsMetadata.filter(m => m.id == key)[0];

                values[key] = getSettingsValue(metadata.type, els);

                return values;
            }, {})
            .value();

        formData.resources = t.findAll('.js-method').filter(el=>el.checked).map(el => el.value);
        formData.tool = t.findAll('.js-tool-field').reduce(function (values, el) {
            values[el.name] = el.value;
            return values;
        }, {});

        Meteor.call('saveToolSettings', t.data.id,
            formData, (err)=> {
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
    methods() {
        return this.reactToolData.get().methods;
    },
    isRequire() {
        return !this.optional;
    },
    showSave() {
        return this.reactToolData.get().settings;
    },
    getInput() {
        var map = {
            text: 'textField',
            list: 'textField',
            'multiple selection': 'multipleSelectionField'
        };
        return map[this.type] || 'textField';
    }
});
