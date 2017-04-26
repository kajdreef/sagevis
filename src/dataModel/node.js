function getChildren(){
    return this.children;
}
    
function addChildren(node){
    this.children.push(node);
}
    
function getParent(){
    return this.parent;
}
    
function setParent(p){
    this.parent = p;
}

export default function Node(data){
    this.id = data.id || 0;
    this.parent = data.parent;
    this.children = [];
    this._children = [];
    
    // Cluster data
    this.global_id = data.global_id;
    this.label = data.label || [];
    this.headMethod = data.headMethod || [];

    // location data
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.width = data.width || 0;
}

Node.prototype = {
    constructor: Node,
    getChildren: getChildren,
    addChildren: addChildren,
    getParent: getParent,
    setParent: setParent
}