import { zoom as d3zoom} from 'd3-zoom';
import { event, select, selectAll } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { zoomPhase, zoomAxis, zoomLabel } from './zoom';
import { getScaleRange } from './getScaleRange';
import Thread from './thread/index';
import Axis from './axis';


var MAX_ZOOM = 50000;

export default class LayeredVisualisation {
    constructor(elemId) {  
        this.elemId = elemId;
        this.labelTransform = { x: 0,y: 0,k: 1};
        this.margin = {
            top: 10,
            right: 20,
            bottom: 0,
            left: 20
        };

        this.threadHeight = 100;
        this.observerList = [];
    }
    
    initVisParameters(numThreads){
        let elemObj = document.querySelector(this.elemId);
        
        if (elemObj == null){
            throw new Error("Element with id '" + this.elemId + "' is not found");
        }
        var elementWidth = elemObj.clientWidth || 800,
            options = {
                width: 0.9 * elementWidth,
                height: 100 * numThreads + 50
            };
        
        this.size = {
            // options.width is the MAX width of the PAGE!
            width: options.width,
            // options.height is the minimum height of the visualisation. NOT OF THE PAGE
            height: options.height
        };
        
        this.sizevis = {
            width: this.size.width - this.margin.right - this.margin.left,
            height: this.size.height
        };
    }
    
    initVisualisation(){
        // initialize the zooming function
        this.zoom = d3zoom()
                // .scaleExtent([1, Infinity])
                .scaleExtent([1, MAX_ZOOM])
                .translateExtent([[0, 0], [this.size.width, this.size.width]])
                .on("zoom", function(){
                    this.update();
                    this.zooming()
                }.bind(this))
        
        // Components of the visualisation.
        this.svg = select(this.elemId)
                    .append("svg:svg")
                        .attr("width", this.size.width)
                        .attr("height", this.size.height + this.margin.top + this.margin.bottom)
                        .append("svg:g")
                            .call(this.zoom);

        // Hidden box so zooming will also work outside the drawn boxes.
        this.svg.append("svg:rect")
                    .attr("class", "hiddenbox zoom")
                    .attr("width", this.size.width)
                    .attr("height", this.size.height + this.margin.top + this.margin.bottom)
                    .style("visibility", "hidden")
                    .attr("pointer-events", "all");

        // The actual visualisation. This contains the axis and threads.
        this.graph = this.svg.append("svg:g")
                            .attr("class", "graph")
                            .attr("transform", "translate(" + [this.margin.left, this.margin.top] + ")");
        
        this.threads = [];
        
        // Element where all the elements will be placed in.
        this.allThreads = this.graph.append("svg:g");
    }

    update(){
        if (event != null && event.hasOwnProperty("type") && event.type == "zoom"){
            this.labelTransform.x = event.transform.x;
            this.labelTransform.y = event.transform.y;
            this.labelTransform.k = event.transform.k;
        }

        this.threads.forEach(function(thread) {
            thread.draw(this.sizevis.width, this.threadHeight, this.labelTransform);
        }.bind(this));
    }
    
    zooming(){
        var hierarchical = selectAll(this.elemId + " g.phaseblocks");
        var labels = selectAll(this.elemId + " g.labels");
        var axis = selectAll(this.elemId + " g.axis--x");

        zoomPhase(hierarchical);
        zoomLabel(labels, this.sizevis)
        zoomAxis(axis, this.xAxis);
    }

    resize(){
        this.size.width = document.querySelector(this.elemId).clientWidth * 0.9;
        
        this.sizevis = {
            width: this.size.width - this.margin.right - this.margin.left,
            height: this.size.height
        };
        
        var svg = select(this.elemId + " svg");
        svg.attr("width", this.size.width);
        
        // Update the phases and labels
        this.update();
        
        // Update the axis
        this.xAxis.resize(this.sizevis.width);
        
        // Fix the zooming
        this.zooming();
    }
    
    setObserver(observer){
        this.observerList.push(observer);
    }
    
    notify(){
        this.observerList.forEach(function (observer) {
            observer.updateViews();
        })
    }
    
    /*
    * @param tree_set - array that contains the tree data structures
    */
    setData(tree_set, number_of_clusters){
        if(tree_set.length == 0){
            return;
        }
        
        let color = null;

        if(number_of_clusters > 0){
            console.log(number_of_clusters);
            color = scaleLinear()
                .domain([0, number_of_clusters-1])
                // .range(["hsl(0, 100%, 50%)", "hsl(120, 100%, 50%)", "hsl(240, 100%, 50%)"]);
                .range(['green' ,'red'])
                 
        }
        
        this.initVisParameters(tree_set.length)
        this.initVisualisation();
        
        let y = 0;
        for(let id = 0; id < tree_set.length; id++){
            
            this.addThread(id, tree_set[id], color, y);
            y += this.threadHeight;
        }
        
        // Add the axis to the visualisation
        this.xAxis = new Axis(this.graph, getScaleRange(this.threads), tree_set.length * this.threadHeight, this.sizevis.width);
    }

    addThread(id, tree, color, y){    
        // Initialize the new Thread and add it to the list.
        var newThread = new Thread(tree, id, this.allThreads, [0, y], color);
        
        newThread.setObserver(this);
        this.threads.push(newThread);
    }
}
