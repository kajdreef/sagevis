import Node from '../node';

export default function TreeNode(data){
    Node.call(this, data);
    
    this.up = function(){
        if(this.children.length > 0) {
            this._children = this.children;
            this.children.forEach(
                function (child) {
                    child.up();
                }
            )
            this.children = [];
        }
    };
    
    this.down = function(){
        if (this._children != [] ){
            this.children = this._children;
            this._children = []
        }
    };
}

TreeNode.prototype = Node.prototype;
