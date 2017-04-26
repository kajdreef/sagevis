var tape = require("tape"),
    trace_vis = require("../");
    

tape("Create tree", function(test) {
    test.throws(
        () => {
            trace_vis.createPhaseTree({})
        },
        Error
    );
    
    test.end();
})

var rootTree;
tape('setup', function(test){
    // GIVEN
    var data = {
        "1": {"id": 1, "cluster_id": 0, "parent": null},
        "2": {"id": 2, "cluster_id": 1, "parent": 1},
        "3": {"id": 3, "cluster_id": 2, "parent": 1},
        "4": {"id": 4, "cluster_id": 3, "parent": 1},
        "5": {"id": 5, "cluster_id": 2, "parent": 4}
    };
    rootTree = trace_vis.createPhaseTree(data);
    test.end();
});

tape("After collapse the root should have '0' children.", function(test){
    //WHEN
    rootTree.collapse()
    
    //THEN
    test.equals(rootTree.getChildren().length, 0);
    
    test.end();
})

tape("After collapse and then unfold the root should have '3' children.", function(test){    
    //WHEN
    rootTree.collapse()
    rootTree.unfold()
    
    //THEN
    let children = rootTree.getChildren()
    test.equals(children.length, 3);    
    
    test.end();
})

tape('teatdown', function(test){
    test.end();
});
