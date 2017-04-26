import {Level} from './Level';
import DataModel from '../index';


function getNodesLevel() {
    let root = this.getRoot(),
        level = root.getCurrLevel(),
        nodes = level.getNodes();
    return nodes;
}

export default function createLayeredTree(levelByKey){
    let root = {
        currLevel:0,
        x: 0,
        width: 1,
        levels:[],
        addLevel: function(l){
            this.levels.push(l);
        },
        up: function (){
            if (this.currLevel <= 0){
                this.currLevel = 0;
            }
            else{
                this.currLevel -= 1;
            }
        },
        down: function(){
            if (this.currLevel < this.levels.length -1){
                this.currLevel += 1;
            }
            else{
                this.currLevel = this.levels.length -1;
            }
        },
        getCurrLevel(){
            return this.levels[this.currLevel];
        }
    };

    for (let key in levelByKey ){
        if (levelByKey.hasOwnProperty(key)){
            // create a level for each level of nodes
            let temp = new Level(levelByKey[key], root)
            root.addLevel(temp);
        }
    }
    
    let layeredTree = Object.assign(Object.create(new DataModel), {
        getNodes: getNodesLevel
    });
    layeredTree.setRoot(root);
    
    return layeredTree;
}
