config = function ({mappingConfig, source, sourceItem}) {
    return {
        sourceField: source.item + '.' + mappingConfig.config.sourceField,
        sourceFieldValue: _.get(sourceItem, mappingConfig.config.sourceField),
        destination: collections[mappingConfig.destination],
        destinationField: collections[mappingConfig.destination].item + '.' + mappingConfig.config.destField,
        destinationFieldValueGetter: (destinationItem)=>_.get(destinationItem, mappingConfig.config.destField)
    };
}