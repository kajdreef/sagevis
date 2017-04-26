export default class Thread {

    constructor(datamodel, id, dom, translate, color) {
        this.dataModel = datamodel;

        this.color = color || null;

        this.domThread = dom.append("svg:g")
                            .attr("class", "thread")
                            .attr("id", "thread_" + id)
                            .attr("transform", "translate("+ translate +")");

        this.size = {
            min: this.dataModel.getStart(),
            max: this.dataModel.getEnd()
        };

        this.hierarchicalVis = this.domThread.append("svg:g")
                                    .attr("class", "phaseblocks");

        this.hierchicalClipPaths =  this.domThread.append("svg:g")
                                    .attr("class", "clipLabel");

        this.hierarchicalLabels = this.domThread.append("svg:g")
                                    .attr("class", "labels");

        this.labelTransform = {
            x: 0,
            y: 0,
            k: 1
        };
        this.observerList = [];
    }

    draw(size, visualizationHeight, labelTransform){
        if (labelTransform != null) this.labelTransform = labelTransform;


        var navBarHeight = visualizationHeight*0.20,
            visHeight = visualizationHeight*0.8,
            // TODO make this go through the controller so it can be abstracted away in the data model
            nodes = this.dataModel.getNodes();

        // Resize functions for the rectangles.
        var resizeWidth = function(d){
                return (d.width * size)* this.labelTransform.k;
            }.bind(this),
            resizeX = function(d){
                return (d.x * size)* this.labelTransform.k;
            }.bind(this);
        
        
        
        // Remove the nodes.
        this.hierarchicalVis.selectAll("g").remove();
        this.hierarchicalLabels.selectAll("g").remove();
        this.hierchicalClipPaths.selectAll(".labelclip").remove();

        // The ID is the clusterid
        var phaseBlock = this.hierarchicalVis.selectAll("g.pblocks").data(nodes)
                                                .enter()
                                                    .append("svg:g")
                                                    .attr("class", "pblocks")
                                                    .attr("id", function (d){return 'cluster' +  d.global_id;});

        var clipPath = this.hierchicalClipPaths.selectAll("g.labelclip").data(nodes)
                                                            .enter().filter(function (d){return d.children.length == 0;});

        var labelBlock = this.hierarchicalLabels.selectAll("g.label-text").data(nodes)
                                                .enter().filter(function (d){return d.children.length == 0;})
                                                    .append("svg:g")
                                                    .attr("id", function (d){return d.id + "l";})
                                                    .attr("class", "label");
        
        // Clip path for the labels so they can't appear outside of their box.
        clipPath.append("svg:clipPath")
            .attr("id", function(d) {return "clip"+ d.id} )
            .attr("class", "labelclip")
            .append("svg:rect")
                .attr("x", resizeX)
                .attr("y", navBarHeight)
                .attr("width", resizeWidth)
                .attr("height", visHeight);

        // Label for each block
        labelBlock.append("svg:text")
                .attr("class", "label-text")
                .attr("clip-path", function(d) {return "url(#clip" + d.id + ")" } )
                .attr("x", function(d) {return ((d.x + (d.width)/2)* size) * this.labelTransform.k;}.bind(this))
                .attr("y", visHeight/2 + navBarHeight)
                .text(function(d) {
                    return d.headMethod;
                })
                .style("text-anchor", "middle")
                .style("font-size", 16)
                .style("text-decoration", function(d){
                    if (d._children.length != 0){
                        return "underline"
                    }
                    else{
                        return "none";
                    }
                })
                .on("click",  function(d){
                    d.down();
                    this.observerList.forEach( function (observer) {
                        observer.notify();
                    })
                }.bind(this));
                
        labelBlock.append("svg:text")
                .attr("class", "label-text")
                .attr("clip-path", function(d) {return "url(#clip" + d.id + ")" } )
                .attr("x", function(d) {return ((d.x + (d.width)/2)* size) * this.labelTransform.k;}.bind(this))
                .attr("y", visHeight/2 + navBarHeight + 15)
                .text(function(d) {
                    return d.label;
                })
                .style("text-anchor", "middle")
                .style("font-size", 12)
                .style("text-decoration", function(d){
                    if (d._children.length != 0){
                        return "underline"
                    }
                    else{
                        return "none";
                    }
                })
                .on("click",  function(d){
                    d.down();
                    this.observerList.forEach( function (observer) {
                        observer.notify();
                    })
                }.bind(this));
                
        
        // Navigation bar....
        phaseBlock.append("svg:rect")
                .attr("x", resizeX)
                .attr("y", function(d) {return d.y;})
                .attr("width", resizeWidth)
                .attr("height", navBarHeight)
                .style("stroke", "black")
                .style("fill", "white")
                .on("click", function(d){
                    let p = d.getParent()
                    if (p != null){
                        p.up();
                    }
                    this.observerList.forEach(function (observer) {
                        observer.notify();
                    })
                }.bind(this));

        // Phase block....
        phaseBlock.append("svg:rect")
            .attr("x", resizeX)
            .attr("y", navBarHeight) 
            .attr("width", resizeWidth)
            .attr("height", visHeight)
            .style("stroke", "black")
            .style("fill", function(d) {
                if(this.color != null){
                    return this.color(d.global_id);
                }
                else{
                    return "#FFFFFF"
                }
            }.bind(this))
            .on("click",  function(d){
                d.down();
                this.observerList.forEach( function(observer) {
                    observer.notify();
                })
            }.bind(this))
            .on("mouseover", function(d){
                console.log(d)
                if (d.global_id == undefined) return null;
                
                // Select all rect with same clusterid
                var rects = document.querySelectorAll('g.pblocks#cluster' + d.global_id);
                console.log('g.pblocks#cluster' + d.global_id);
                console.log(rects);
                
                // Highlight the same clusters
                rects.forEach(function(rect){
                    rect.setAttribute("stroke-width", 5);
                });
                
            })
            .on("mouseout", function(d){
                if (d.global_id == undefined) return null;
                
                // Select all rect with same clusterid
                var rects = document.querySelectorAll('g.pblocks#cluster' + d.global_id);
                
                // Remove the highlight the same clusters
                rects.forEach(function(rect){
                    rect.setAttribute("stroke-width", 1);
                });
            });

        phaseBlock.exit().remove();
        labelBlock.exit().remove();
        clipPath.exit().remove()
    }

    getSizeMin(){
        return this.size.min;
    }

    getSizeMax(){
        return this.size.max;
    }
    
    setObserver(observer){
        this.observerList.push(observer);
    }
    
    notifyObservers(){
        this.observerList.forEach(function(observer) {
            observer.notify();
        })
    }
}
