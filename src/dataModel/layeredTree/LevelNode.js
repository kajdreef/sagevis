import Node from '../node';

export default function LevelNode(data){
    Node.call(this, data);
    
    this.up = function  (){
        this.parent.up();
    };
    
    this.down = function (){
        this.parent.down();
    };
}

LevelNode.prototype = Node.prototype;