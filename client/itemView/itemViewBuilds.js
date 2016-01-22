function tree(){
    let build = this;
    let jobs = build.jobs;
    let roots = build.jobs.filter(j => !j.parent);

    debugger;
    roots.forEach(r => treeify(r, jobs));

    return roots;
}

function treeify(current, jobs){
    let children = jobs.filter(j => j.parent == current.number);

    if (!children || !children.length){
        return current;
    }

    children.forEach(j => treeify(j, jobs));

    current.children = children;

    return current;
}

Template.itemViewBuilds.helpers({tree});

Template.itemViewBuilds.events({
    'click .build-info'(event){
        let next = event.target.parentNode.nextElementSibling;
        next.style.display = next.style.display == 'none' ? 'table-row' : 'none';
    }
});