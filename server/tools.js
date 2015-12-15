var findToolById = function (id) {
    var tools = Meteor.settings.tools;
    return _.find(tools, tool => tool.id === id);
};


Tool = class Tool {

    static getAll(config, resource) {

        var urlBase = config.url || findToolById(config.id).url;

        var url = `${urlBase}/${resource}?token=${config.token}&take=1000`;

        var result = [];
        while (url) {
            var items = HTTP.get(url).data;
            result = result.concat(items[resource]);
            url = items.next;
        }
        return result;
    }
};