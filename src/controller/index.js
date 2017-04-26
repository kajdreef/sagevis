export default class ViewController{
    constructor(){
        this.data = [];
        this.numClusters = null;
        this.views = [];
    }
    
    addView(view){        
        view.setData(this.data, this.numClusters);
        this.views.push(view);        
        view.setObserver(this);
    }
    
    updateViews(){
        this.views.forEach(
            function (view) {
                view.update();
            }
        )
    }
    
    resize(){
        this.views.forEach(
            function (view) {
                view.resize();
            }
        )
    }
    
    setData(data, numClusters){
        this.data = data;
        this.numClusters = numClusters;
        
        this.views.forEach(
            function (view) {
                view.setData(this.data, this.numClusters);
            }.bind(this)
        )
    }
    
    getData(){
        return this.data;
    }
}