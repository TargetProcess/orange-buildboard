var findToolById = function (id) {
    var tools = Meteor.settings.tools;
    return _.find(tools, tool => tool.id === id);
};

var generateToken = ()=> {
    return CryptoJS.MD5((new Date()).toString()).toString();
};

Tool = {
    getAll(config, resource) {

        var urlBase = config.url || findToolById(config.id).url;

        var url = `${urlBase}/${resource}?token=${config.accountToken}&take=1000`;

        var result = [];
        while (url) {
            var items = HTTP.get(url).data;
            result = result.concat(items[resource]);
            url = items.next;
        }
        return result;
    },
    getMetaSettings(config) {
        var url = config.url || findToolById(config.id).url;
        return new Promise((resolve, reject)=> {
            HTTP.get(url, (err, res)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.data);
                }
            })
        });
    },
    getToolSettings({accountToken, settings, id:toolId, url}) {
        accountToken = accountToken || generateToken();
        var urlBase = url || findToolById(toolId).url;
        var apiUrl = `${urlBase}/account/${accountToken}?token=${Meteor.settings.secret}`;
        return new Promise(function (resolve, reject) {
            HTTP.get(apiUrl, (err, result)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.data)
                }
            });
        });
    },
    saveToolSettings({accountToken, settings, toolId, url}) {
        accountToken = accountToken || generateToken();
        var urlBase = url || findToolById(toolId).url;
        var apiUrl = `${urlBase}/account/${accountToken}?token=${Meteor.settings.secret}`;
        return new Promise(function (resolve, reject) {
            HTTP.post(apiUrl, {data: {accountToken, config: settings}}, (err, result)=> {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.data)
                }
            });
        });
    }
};