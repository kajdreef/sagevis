export default function getTreeNodes(){
    let tree = this,
        leaveNodes = [],
        root = tree.getRoot(),
        children = root.getChildren();
    
    
    if(children.length == 0){
        leaveNodes.push(root);
    }
    else{
        children.forEach(function(d){
            leaveNodes.push.apply(leaveNodes, getNodes(d));
        });
    }
    return leaveNodes;
}

function getNodes(d){
    let root = d,
        leaveNodes = [],
        children = root.getChildren();
        
    if (children.length == 0) {
        leaveNodes.push(root);
    }
    else{
        children.forEach(function(d) {
            leaveNodes.push.apply(leaveNodes, getNodes(d));
        })
    }
    return leaveNodes;
}