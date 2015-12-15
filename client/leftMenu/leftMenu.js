Template.leftMenu.helpers({
    items(){
        return [
            {href: `/${currentAccountName()}`, name: 'My work'},
            {href: `/${currentAccountName()}/branches`, name: 'Branches'},
            {href: `/${currentAccountName()}/tasks`, name: 'Tasks'}
        ];
    }
});