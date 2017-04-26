import { event } from 'd3-selection';
import { select } from 'd3-selection';

var prev_event = null;

export function zoomPhase(obj) {
    if ( event == null ) return null;
    
    var transform = event.transform || undefined,
        translateX = transform.x || 0,
        translateY = 0,
        translate = [translateX, translateY];
            
    obj.attr("transform", "translate(" + translate + ")");
    
    if(event != null) {
        prev_event = event;
    }
}

export function zoomLabel(obj,size){    
    if ( event == null ) return null;
    
    var scale = event.transform.k || 1,
        translateX = event.transform.x || 0,
        translateY = 0,
        translate = [translateX, translateY];
    
    obj.selectAll("text").each(function(d){
        var xText = d.x * size.width + (d.width*size.width)/2,
            xTextNew = xText * scale;
    
        select(this).attr("x", xTextNew);
    });
    
    obj.attr("transform", "translate(" + translate + ")");
    
    if(event != null) {
        prev_event = event;
    }
}

export function zoomAxis(obj, gAxis){
    var e = event || prev_event;
    
    if ( e == null ) return null;
        
    var scale = gAxis.getScale();
    var axis = gAxis.getAxis();
    
    obj.call(axis.scale(e.transform.rescaleX(scale)));
}
