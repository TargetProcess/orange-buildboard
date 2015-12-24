Template.leftMenu.helpers({
    items(){
        return [
            {href: `/${currentAccountName()}`, name: 'My work'}]
            .concat(
                _.chain(collections)
                    .filter(c=>c.mappings && c.mappings.length > 0)
                    .map(collection=>(
                    {
                        href: `/${currentAccountName()}/${collection.id}`,
                        name: collection.id.charAt(0).toUpperCase() + collection.id.substr(1)
                    }
                    ))
                    .value());
    }
});