/**
* version : 0.1.20110630.2
* change : render function : created
*          draw function : created
*          numrend var : created
*/
(function (){
  //Creating a framework named SCCanvas
  var SCCanvas = {
    canvas: {},
    canvasid: {},
    context: {},
    framerate: 0,
    elements: {},
    numrend: 0,
    /**
    * init function
    * @id : id of the canvas (string)
    * @width : width of the canvas (number)
    * @height : height of the canvas (number)
    * @framerate : framerate of the sketch (number)
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
    },
    /**
    * adding element(s) in the renderer queue
    * @elt : elements (array or object)
    *        an object element : 
    *        {
    *          z: depth (number) - not necessary (0 by default),
    *          color: color (object) - not necessary ({r:0, g:0, b:0} by default),
    *          id: identifier (string) - not necessary (will be set by SCC if not) but usefull if you want to refind your elt later
    *        };
    * @render : rendering after adding ? (boolean) - not necessary
    **/
    add: function(param){
      var tab = [];
      var e = param.elt ? param.elt : {};
      var r = (param.render && typeof param.render === 'boolean') ? param.render : false;
      Object.prototype.toString.apply(e) === '[object Array]' ? tab = e : tab.push(e);
      for(ind in tab){
        var newE = tab[ ind ];
        if(!newE.z || newE.z === undefined || newE.z == null) newE.z = 0; // z        
        if(!newE.color || newE.color === undefined || newE.color == null) newE.color = {r:0, g:0, b:0}; // default color
        if(!newE.id || typeof newE.id !== 'string') { // id
          var dateTemp = new Date();
          newE.id = dateTemp.getTime().toString();
        }
        this.elements[ newE.id ] = newE;
      }
      return (r ? this.render() : this);
    },
    /**
    * render function
    **/
    render: function(param){
      return this;
    },
    /**
    * drawing elements method
    * @param : no param
    **/
    draw: function(){
      this.numrend++;
      // clean matrix
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // z sort
      var sortedElements = [];
      for(var id in this.elements){
        sortedElements.push(this.elements[ id ]);
      }
      sortedElements.sort(function(a,b){ return a.z - b.z; });
      // draw
      for(var sortedId in sortedElements){
        if(sortedElements[ sortedId ].draw && typeof sortedElements[ sortedId ].draw === 'function'){
          sortedElements[ sortedId ].draw( this.context );
        }
      }
      // chaining pattern return
      return this;
    }
  };
  // shortcut
  if(!window.SCC){window.SCC = SCCanvas;}
})();