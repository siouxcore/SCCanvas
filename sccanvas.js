/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCCanvas is a tiny framework for HTML5.canvas in javascript - siouxcore@gmail.com
* SCCanvas is under MIT license
* version : 0.1.20110701.2
* change : add function : no default color + managing defaultDraw + change in id setting
*          defaultDraw function : created
*          render function : completed
*          rendering attribute : added
*          eventQIsEmpty function : created
*          eventQ attribute : added
*          gendId attribute : added (and creepy)
* change (2) : defaultDraw function : fixed circle part
**/
(function (){
  // SCCanvas
  var SCCanvas = {
    canvas: {},
    canvasid: {},
    context: {},
    framerate: 0,
    elements: {},
    numrend: 0,
    rendering: false,
    eventQ: {
      click: {},
      rclick: {},
      cclick: {},
      mousein: {},
      mouseout: {},
      drag: {},
      release: {},
      keypressed: {},
      keyreleased: {}    
    },
    genId: 2121548977435,
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
    *          mask: (array || object {
    *                                   radius, 
    *                                   center:{
    *                                           x, (number)
    *                                           y  (number)
    *                                          } 
    *                                 } )
    *        };
    * @render : rendering after adding ? (boolean) - not necessary, true by default
    **/
    add: function(param){
      var tab = [];
      var e = param.elt ? param.elt : {};
      var r = (param.render && typeof param.render === 'boolean') ? param.render : true;
      Object.prototype.toString.apply(e) === '[object Array]' ? tab = e : tab.push(e);
      for(ind in tab){
        var newE = tab[ ind ];
        if(!newE.z || newE.z === undefined || newE.z == null) newE.z = 0; // z        
        if(!newE.id || typeof newE.id !== 'string') newE.id = (this.genId++).toString();// id
        this.elements[ newE.id ] = newE;
      }
      return (r ? this.render() : this);
    },
    /**
    * render function
    * @noparam
    **/
    render: function(param){    
      return this.draw();
    },
    /**
    * check if event queue is empty
    * @noparam
    **/
    eventQIsEmpty: function(){
      for(var ev in this.eventQ){
        for(var id in this.eventQ[ ev ]){
          return false;
        }
      }
      return true;    
    },
    /**
    * drawing elements method
    * @noparam
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
        } else {
          this.defautltDraw( {elt: sortedElements[ sortedId ]} );
        }
      }
      // chaining pattern return
      return this;
    },
    /**
    * default drawing functioin
    * @elt : an element
    **/
    defautltDraw: function(param){
      if(param.elt && param.elt.mask){
        if(Object.prototype.toString.apply(param.elt.mask) === '[object Array]'){ // an array of points ; it's a shape
          this.context.beginPath();
          this.context.strokeStyle = 'black';
          for(var i = 0; i < param.elt.mask.length; i++){
            this.context.lineTo(param.elt.mask[i].x, param.elt.mask[i].y);
          }
          this.context.closePath();
          this.context.stroke();          
        } else if(typeof param.elt === 'object' 
                  && typeof param.elt.mask === 'object' 
                  && typeof param.elt.mask.radius === 'number' 
                  && typeof param.elt.mask.center === 'object'){ // a circle
            this.context.beginPath();
            this.context.strokeStyle = 'black';
            this.context.arc(param.elt.mask.center.x, 
                              param.elt.mask.center.y, 
                              param.elt.mask.radius, 
                              0, Math.PI*2, true);
            this.context.closePath();  
            this.context.stroke();          
        }
      }
      // chaining pattern
      return this;
    }
  };
  // shortcut
  if(!window.SCC){window.SCC = SCCanvas;}
})();