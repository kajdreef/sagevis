let DataModel = function(){
    let root = null;
    
    var getNodes = function(){
        return [];
    },
    setRoot = function(rootNode){
        root = rootNode;
    },
    getRoot = function(){
        return root;
    },
    getStart = function(){
        return root.x;
    },
    getEnd = function(){
        return root.width;
    };
    
    return {
        getNodes: getNodes,
        setRoot: setRoot,
        getRoot: getRoot,
        getStart: getStart,
        getEnd: getEnd
    }
};

export default DataModel