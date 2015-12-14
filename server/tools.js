var findToolByTypeAndId = function (type, id) {
    var tools = Meteor.settings.tools;
    var tool = _.chain(tools)
        .find(tool => tool.type === type)
        .pick('tools').value();
    return _.find(tool.tools, tool=>tool.id === id);
};
class ToolBase {
    constructor(config, toolType) {
        if (config) {
            var tool = findToolByTypeAndId(toolType, config.toolId);
            this._url = Meteor.settings.url + ':' + tool.port;
            this._accountToken = config.accountToken;
        }
    }

    _get(resource) {
        if (this._url) {
            var url = this._url + `/${resource}?token=${this._accountToken}&take=1000`;

            var result = [];
            while (url) {
                var items = HTTP.get(url).data;
                result = result.concat(items[resource]);
                url = items.next;
            }
            return result;
        }
        else {
            return [];
        }
    }
}

PMTool = class PMTool extends ToolBase {
    constructor(config) {
        super(config, 'PMTool');
    }

    getTasks() {
        return this._get('tasks');
    }
};

CodeTool = class CodeTool extends ToolBase {
    constructor(config) {
        super(config, 'CodeTool');
    }

    getBranches() {
        return this._get('branches');
    }
};

BuildTool = class BuildTool extends ToolBase {
    constructor(config) {
        super(config, 'BuildTool');
    }

    getBuilds() {
        return this._get('builds');
    }
};