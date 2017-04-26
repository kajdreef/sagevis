import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

export default class Axis {
    constructor(domObject, domain, location, width){
                
        this.domain = domain;
        
        // Create scale for axis
        this.scale = scaleLinear()
            .domain([this.domain.min, this.domain.max])
            .range([0, width]);
            
        // create the axis
        this.axis = axisBottom(this.scale)
                    .ticks(10);
                    
        // 
        this.gX = domObject.append("svg:g")
                    .attr("class", "axis--x")
                    .attr("transform", "translate(0," + location + ")")
                    .call(this.axis);
        
        // Add time label.
        this.gX.append("svg:text")
                        .attr("id", "xAxisLabel")
                        .attr("fill", "#000")
                        .attr("y", 20)
                        .attr("x", width/2)
                        .attr("dy", ".71em")
                        .text("Time");   
    }
    
    resize(width){
        this.scale = scaleLinear()
            .domain([this.domain.min, this.domain.max])
            .range([0, width]);
            
        this.axis = axisBottom(this.scale);
        
        select("g.axis--x").call(this.axis);
        
        var xAxisLabel = select("#xAxisLabel");
        xAxisLabel.attr("x", width/2);
    }
    
    getAxis(){
        return this.axis;
    }
    
    getScale(){
        return this.scale;
    }
}
