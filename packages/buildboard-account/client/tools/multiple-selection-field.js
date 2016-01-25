Template.multipleSelectionField.helpers({
    isCurrent: function (current) {
        let value = this.toString();

        if (!current) {
            return false;
        }

        if (_.isArray(current)) {
            return current.sort().indexOf(value) > -1;
        }

        return current == value;
    }
});
