import TreeNode from './TreeNode';
import DataModel from '../index';
import getTreeNodes from './getTreeNodes';

export default function createTree(phaseByKey){
    var node,
        parent,
        parentId,
        root = null,
        key;

    // Create list of nodes.
    for(key in phaseByKey){
        if(phaseByKey.hasOwnProperty(key)){
            let temp = new TreeNode(phaseByKey[key]);
            phaseByKey[key] = temp;
        }
    }
    
    // Link nodes depending on the children/parent
    for(key in phaseByKey){
        node = phaseByKey[key];
        
        parentId = node.getParent();
        if (parentId == null) {
            if (root) throw new Error("Multiple root nodes defined...");

            root = node;
        }
        else {
            parent = phaseByKey[parentId];
            node.setParent(parent);
            parent.addChildren(node);
        }
    }

    if(root == null) throw new Error("No root node was defined...");

    let tree = Object.assign(Object.create(new DataModel), {
        getNodes: getTreeNodes
    });

    tree.setRoot(root);
    
    return tree;
}