/**
*
*/
(function (){
  //Creating a framework named SCCanvas
  var SCCanvas = {
    canvas: {},
    canvasid: {},
    context: {},
    framerate: 0,
    elements: [],
    /**
    * init function
    * @param : param
    **/
    init: function(param){
      // create the canvas
      if(param.id && typeof param.id === 'string'){
        this.canvas = document.getElementById(param.id);
        // if canvas does not exist yet
        if(this.canvas === null){
          // we create the canvas
          this.canvas = document.createElement("canvas");
          this.canvas.setAttribute("id", param.id);
          // and insert just at the begining of the body
          document.getElementsByTagName("body")[0].appendChild(this.canvas);
        }
        this.canvasid = param.id;
        this.context = context = this.canvas.getContext('2d');
        if(param.width && typeof param.width === 'number'){
          this.canvas.setAttribute('width', param.width.toString());
        }
        if(param.height && typeof param.height === 'number'){
          this.canvas.setAttribute('height', param.height.toString());
        }
        if(param.framerate && typeof param.framerate === 'number'){
          this.framerate = param.framerate;
        }        
      }
      // chaining pattern, return this
      return this;
    }
  };

  // shortcut
  if(!window.SCC){window.SCC = SCCanvas;}

})();
/*SCC.init({
  id: "canvas-test",
  width: 600,
  height: 400,
  framerate: 30
});*/