import LevelNode from './LevelNode';

export function Level(nodes, parent){   
    this.data = [];
     
    nodes.forEach(function(n) {
        let node = new LevelNode(n);
        node.setParent(parent);
        this.data.push(node);
    }.bind(this))
}

Level.prototype.getNodes = function(){
    return this.data;
};