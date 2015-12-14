findToolByTypeAndId = function (type, id) {
    var tools = Meteor.settings.tools;
    var tool = _.chain(tools)
        .find(tool => tool.type === type)
        .pick('tools').value();
    return _.find(tool.tools, tool=>tool.id === id);
};
createToolAccount = function (type, id, key, params) {
    var settings = Meteor.settings;
    var tool = findToolByTypeAndId(type, id);
    var url = settings.url + ':' + tool.port + '/account/' + key + `?token=${settings.secret}`;
    return new Promise(function (resolve, reject) {
        HTTP.post(url, {data: params}, (err, result)=> {
            if (err) {
                reject(err);
            } else {
                resolve(result)
            }
        });
    });

};
Meteor.methods({
    getToolsSettings(t, account) {
        var settings = Meteor.settings;
        var tool = findToolByTypeAndId(t.type, t.id);
        var url = settings.url + ':' + tool.port;
        var accountSettings = {};
        if(account) {
            var accountUrl = settings.url + ':' + tool.port + '/account/' + account + `?token=${settings.secret}`;
            try {
                accountSettings = HTTP.get(accountUrl).data.config;
            } catch(e) {
                accountSettings = {};
            }

        }

        return _.map(HTTP.get(url).data.settings, (obj, key)=> {
            if(accountSettings[key]) {
                obj.currentValue = accountSettings[key];
            }
            obj.name = key;
            return obj;
        });
    }
});