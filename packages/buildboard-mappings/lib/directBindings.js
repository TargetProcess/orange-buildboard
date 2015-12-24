directBindings = {
    added({mappingConfig, source, sourceItem, account}) {

        let config2 = config({mappingConfig, source, sourceItem});
        //console.log(config2);
        var {
            sourceField,
            sourceFieldValue,
            destination,
            destinationField,
            destinationFieldValueGetter
            } = config2;

        var destinationItems = findItems({mappingConfig, account, items: [sourceItem]});

        destinationItems.forEach(destinationItem=> {
            let destinationFieldValue = destinationFieldValueGetter(destinationItem);
            let result = Items.upsert({
                    [destination.item + '.tool']: destinationItem.tool,
                    [destinationField]: destinationFieldValue
                },
                {
                    $set: {
                        [source.item]: sourceItem,
                        [destination.item]: destinationItem
                    }
                }, {multi: true});

            console.log(result);

            Items.remove({
                [destinationField]: destinationFieldValue,
                [sourceField]: {$exists: false}
            });
        });

        if (destinationItems.count() == 0) {
            Items.insert({[source.item]: sourceItem});
        } else {
            Items.remove({
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool,
                [destination.item]: {$exists: false}
            });
        }

    },
    changed({mappingConfig, source, sourceItem}){
        var {
            sourceField,
            sourceFieldValue,
            } = config({mappingConfig, source, sourceItem});

        Items.update(
            {
                [source.item + '.tool']: sourceItem.tool,
                [sourceField]: sourceFieldValue
            },
            {
                $set: {
                    [source.item]: sourceItem
                }
            },
            {multi: true});
    },
    removed({mappingConfig, source, sourceItem}){
        var {
            sourceField,
            sourceFieldValue,
            destination
            } = config({mappingConfig, source, sourceItem});

        Items.remove({
            [sourceField]: sourceFieldValue,
            [source.item + '.tool']: sourceItem.tool,
            [destination.item]: {$exists: false}
        });

        Items.update(
            {
                [sourceField]: sourceFieldValue,
                [source.item + '.tool']: sourceItem.tool
            }, {$unset: {[source.item]: sourceItem}}, {multi: true});
    }
};