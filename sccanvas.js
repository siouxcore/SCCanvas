/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCCanvas is a tiny framework for HTML5.canvas in javascript - siouxcore@gmail.com
* SCCanvas is under MIT license
* version : 0.1.20110720.1
* change : defaultDraw function : correction of the name
*           rendering modification : (...) to check
*           attr management in init method
**/
(function (){

  /**
  * function __attach - from processing.js
  * @elem
  * @type
  * @fn
  */
  function __attach(elem, type, fn) {
    if (elem.addEventListener) {
      elem.addEventListener(type, fn, false);
    } else {
      elem.attachEvent("on" + type, fn);
    }
  };
  /**
  * function __eventManager 
  * @e : event
  */
  function __eventManager(e){
    if(e.type == "mousemove"){ 
      var element = this;
      var offsetX = 0, offsetY = 0;
      this.SCC.pmouseX = this.SCC.mouseX;
      this.SCC.pmouseY = this.SCC.mouseY;
      if (element.offsetParent) {
        do {
          offsetX += element.offsetLeft;
          offsetY += element.offsetTop;
        } while (element = element.offsetParent);
      }
      this.SCC.mouseX = e.pageX - offsetX;
      this.SCC.mouseY = e.pageY - offsetY;
      if(this.SCC.mousePressed === false){    
        if(this.SCC.hoveredId === ""){ // check if there is a new hovered obj
          this.SCC.mousein(false);
        }else{
          this.SCC.mouseout(false); // check if the current hovered obj is still hovered
        }
      }else{       
        this.SCC.mouseDraged = true;
        this.SCC.drag(false);
      }
    } else if(e.type == "mousedown"){
        this.SCC.mousePressed = true;
    } else if(e.type == "mouseup"){
      this.SCC.mousePressed = false;
      if(this.SCC.mouseDraged){
        this.SCC.mouseDraged = false;
        if(this.SCC.dragedId != ""){
          this.SCC.release(false);
        }
      }else{
        this.SCC.click(false, e.which);
      }
    } 
  };  
  /**
  * function __mouseOut
  * @e : event
  */
  function __mouseOut(e){
    var rend = false;
    if(this.SCC.dragedId != ""){
      var ds = this.SCC.elements[ this.SCC.dragedId ];
      if(ds.release){
        this.SCC.eventQ.release[ this.SCC.dragedId ] = 0;
        rend = true;
      }
      this.SCC.dragedId = "";
    }
    if(this.SCC.hoveredId != ""){
      var hs = this.SCC.elements[ this.SCC.hoveredId ];
      if(hs.mouseout){
        this.SCC.eventQ.mouseout[ this.SCC.hoveredId ] = 0;
        rend = true;
      }
      this.SCC.hoveredId = "";
    }
    this.SCC.mouseDraged = false;
    this.SCC.mousePressed = false;
    rend && __render(false, this.SCC);
  };  
  /**
  * function __render
  * @force : force rendering
  * @c : SCC instance
  */
  function __render(force, c){
    if(force == false && c.rendering == false){  // on est pas deja en train de rendre
      var looping = window.setInterval(function(){
        c.rendering = true;
        c.proceed();
        if(c.eventQIsEmpty() == true && c.dragedId == ""){
          c.rendering = false; // on sort du rendu
          window.clearInterval(looping);
          return c;
        }
      }, c.millisec);
    }else{
      return c.eventQIsEmpty() ? c.draw() : c;
    }
  };  
  
  // SCCanvas
  var SCCanvas = {
    canvas: {},
    canvasid: {},
    context: {},
    millisec: 0,
    elements: {},
    numrend: 0,
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
    mouseX: 0,
    mouseY: 0,
    pmouseX: 0,
    pmouseY: 0,
    mousePressed: false,
    mouseDraged: false,
    hoveredId: "",
    dragedId: "",
    rendering: false,
    /**
    * init function
    * @id : id of the canvas (string)
    * @width : width of the canvas (number)
    * @height : height of the canvas (number)
    * @millisec : millisec of the sketch (number)
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
        this.canvas.SCC = this;
        this.canvasid = param.id;
        this.context = context = this.canvas.getContext('2d');
        if(param.width && typeof param.width === 'number')
          this.canvas.setAttribute('width', param.width.toString());
        if(param.height && typeof param.height === 'number')
          this.canvas.setAttribute('height', param.height.toString());
        if(param.millisec && typeof param.millisec === 'number')
          this.millisec = param.millisec;
      }
      // css-attributes
      for(ind in param.attr){
        this.canvas.setAttribute( ind, param.attr[ ind ] );
      }
      // event management
      __attach(this.canvas, "mousemove", __eventManager);
      __attach(this.canvas, "mouseout", __mouseOut);    
      __attach(this.canvas, "mouseup", __eventManager);
      __attach(this.canvas, "mousedown", __eventManager);       
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
    *          mask: (array || object || function {
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
      var tab = [],
          e = param.elt ? param.elt : {},
          r = (param.render && typeof param.render === 'boolean') ? param.render : true;
      Object.prototype.toString.apply(e) === '[object Array]' ? tab = e : tab.push(e);
      for(ind in tab){
        var newE = tab[ ind ];
        if(!newE.z || newE.z === undefined || newE.z == null) newE.z = 0; // z        
        if(!newE.id || typeof newE.id !== 'string') newE.id = (this.genId++).toString();// id
        this.elements[ newE.id ] = newE;
      }
      return (r ? __render(true, this) : this);
    },
    /**
    * removing element(s) in the renderer queue
    * @id 
    **/    
    remove: function(param){
      for(var ev in this.eventQ){
        for(id in this.eventQ[ev]){
          if(sh == param.id){
            delete this.eventQ[ev][id];
          }
        }
      }
      delete this.elements[ param.id ];
      return __render(true, this);    
    },
    /**
    * removing element(s) in the renderer queue
    * @id 
    **/        
    find: function(param){
      return this.elements[ param.id ];
    },
    /**
    * launch an eternal event
    * @id (not necessary)
    * @event : event name
    **/
    bang: function(param){
      if(!this.eventQ[param.event]){
        this.eventQ[param.event] = {}; // create the event in the eventQ if doesen't exist yet
      }      
      if(typeof param.id === 'undefined' || param.id == null){ // we try to banged every objects
        for(ind in this.elements){
          var el = this.elements[ ind ];
          if(el[ param.event ] && typeof el[ param.event ] === 'function'){ 
            this.eventQ[param.event][el.id] = 0;        
          }
        }
      }else if(this.elements[param.id] && this.elements[param.id][param.event]){
        this.eventQ[param.event][param.id] = 0;
      }
      return __render(false, this);         
    },
    /**
    * proceed function : eventQ management 
    * @noparam
    */
    proceed: function(){
      for(var ev in this.eventQ){
        for(var id in this.eventQ[ev]){
          var step = this.eventQ[ev][id];
          var sh = this.elements[id];
          var ret = sh[ev](step, this); // execute the event function of the object
          if(!ret || ret == false){ // end of the event function
            // remove the event from the event queue
            delete this.eventQ[ev][id];
          } else{ // increase the step of the function
            this.eventQ[ev][id] = step + 1;
          }
        }
      }
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
      sortedElements.sort(function(a,b){ return (a.z - b.z) == 0 ? a.id.localeCompare(b.id) : (a.z - b.z); });
      // draw
      for(var sortedId in sortedElements){
        if(sortedElements[ sortedId ].draw && typeof sortedElements[ sortedId ].draw === 'function'){
          sortedElements[ sortedId ].draw( this.context );
        } else {
          this.defaultDraw( {elt: sortedElements[ sortedId ]} );
        }
      }
      // chaining pattern return
      return this;
    },
    /**
    * default drawing functioin
    * @elt : an element
    **/
    defaultDraw: function(param){
      if(param.elt && param.elt.mask){
        var mask = typeof param.elt.mask === 'function' ? param.elt.mask() : param.elt.mask;
        this.context.strokeStyle = param.elt.stroke ? param.elt.stroke : 'black';
        this.context.fillStyle = param.elt.fill ? param.elt.fill : 'black';
        this.context.lineWidth = param.elt.strokeWeight ? param.elt.strokeWeight : 1;
        if(Object.prototype.toString.apply(mask) === '[object Array]'){ // an array of points ; it's a shape
          this.context.beginPath();
          for(var i = 0; i < mask.length; i++){
            this.context.lineTo(mask[i].x, mask[i].y);
          }
          this.context.closePath();
        } else if(typeof param.elt === 'object' 
                  && typeof mask === 'object' 
                  && typeof mask.radius === 'number' 
                  && typeof mask.center === 'object'){ // a circle
            this.context.beginPath();
            this.context.strokeStyle = 'black';
            this.context.arc(mask.center.x, 
                              mask.center.y, 
                              mask.radius, 
                              0, Math.PI*2, true);
            this.context.closePath();  
        }
        this.context.fill();  
        this.context.stroke();
      }
      // chaining pattern
      return this;
    },
    /**
    * distance function
    **/
    dist: function() {
      var dx, dy, dz;
      if (arguments.length === 4) {
        dx = arguments[0] - arguments[2];
        dy = arguments[1] - arguments[3];
        return Math.sqrt(dx * dx + dy * dy);
      } else if (arguments.length === 6) {
        dx = arguments[0] - arguments[3];
        dy = arguments[1] - arguments[4];
        dz = arguments[2] - arguments[5];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    },
    /**
    * intersect function
    * @point : {x (number),y (number)}
    * @shape
    **/
    intersect: function(point, shape){
      if(shape.intersect && typeof shape["intersect"] === "function"){
        return shape.intersect(point);
      } else {  
        if(shape.mask){
          var mask = typeof shape.mask === 'function' ? shape.mask() : shape.mask;
          // circle mask
          if(mask.center && mask.radius){
            return (this.dist(point.x, point.y, shape.mask.center.x, shape.mask.center.y) <= shape.mask.radius ); 
          }
          // polygon mask
          var c = false,
              j = mask.length - 1;
          for(var i = 0; i < mask.length; j = i++){
            if ((((mask[i].y <= point.y) && (point.y < mask[j].y)) ||
                 ((mask[j].y <= point.y) && (point.y < mask[i].y))) &&
                (point.x < (mask[j].x - mask[i].x) * 
                (point.y - mask[i].y) / (mask[j].y - mask[i].y) + mask[i].x))
              c = !c;
          }
          return c;                    
        } else {
          return false;
        }
      }
    },
    /**
    * targetMouse function : check wich element the mouse is currently targeting
    * @noparam
    */
    targetMouse: function(){
      var tt = [];
      for(var id in this.elements){
        var shape = this.elements[id];
        if(this.intersect({x:this.mouseX,y:this.mouseY}, shape) == true){
          tt.push(shape);
        }
      }
      // searching for the z >
      if(tt.length >= 1){
        tt.sort(function(a,b){
          return b.z - a.z;
        });
        return tt[0];
      }
      return null;
    },
    /**
    * mousein function
    * @rend : force rendering ?
    */
    mousein: function(rend){
      var shape = this.targetMouse();
      if(shape != null && shape.mousein){
        this.hoveredId = shape.id;
        this.eventQ.mousein[ this.hoveredId ] = 0;  // init with the step
        rend = true;  
      }
      rend && __render(false, this);
    },
    /**
    * mouseout function
    * @rend : force rendering ?
    */
    mouseout: function(rend){
      // is the current hover obj still hovered
      var shape = this.targetMouse();
      if(shape == null){ // mouse has left the object & is on no others
        var previous = this.elements[ this.hoveredId ];
        if(previous && previous.mouseout){
          this.eventQ.mouseout[ this.hoveredId ] = 0;  // init with the step
          delete this.eventQ.mousein[ this.hoveredId ]; // create bugs
        }
        this.hoveredId = "";
        rend = true;
      } else if(shape.id != this.hoveredId){ // mouse in a diff shape
        var previous = this.elements[this.hoveredId];
        if(previous && previous.mouseout){
          this.eventQ.mouseout[ this.hoveredId ] = 0;  // init with the step
          delete this.eventQ.mousein[ this.hoveredId ]; // create bugs
          this.hoveredId = "";
          rend = true;    
        }
        if(shape.mousein){
          this.hoveredId = shape.id;
          this.eventQ.mousein[ this.hoveredId ] = 0;  // init with the step
          rend = true;    
        }
      } 
      rend && __render(false, this);   
    },
    /**
    * drag function
    * @rend : force rendering ?
    */
    drag: function(rend){
      if(this.dragedId == ""){
        var shape = this.targetMouse();
        if(shape != null && shape.drag){
          this.eventQ.drag[shape.id] = 0;
          this.dragedId = shape.id;
          rend = true;
        }
      }else{
        this.eventQ.drag[this.dragedId] = 0;
        rend = true;
      }
      rend && __render(false, this);
    },
    /**
    * release function
    * @rend : force rendering ?
    */
    release: function(rend){
      var shape = this.elements[this.dragedId];
      if(shape.release){
        this.eventQ.release[ this.dragedId ] = 0;  // init with the step
        rend = true;
      }
      this.dragedId = ""; // erase the draggedId
      rend && __render(false, this); 
    },
    /**
    * click function
    * @rend : force rendering ?
    * @wich : wich button
    */
    click: function(rend, which){
      var shape = this.targetMouse();
      switch (which){
      case 1 : 
        if(shape != null && shape.click){
          // put the obj in eq.click
          this.eventQ.click[ shape.id ] = 0;  // init with the step
          rend = true;
        }
        break;
      case 2 : 
        if(shape != null && shape.cclick){
          // put the obj in eq.centerclick
          this.eventQ.cclick[ shape.id ] = 0;  // init with the step
          rend = true;
        }
        break;
      case 3 : 
        if(shape != null && shape.rclick){
          // put the obj in eq.rightclick
          this.eventQ.rclick[ shape.id ] = 0;  // init with the step
          rend = true;
        }
        break;	  	  
      }
      rend && __render(false, this);
    }   
  };
  // shortcut
  if(!window.SCC){window.SCC = SCCanvas;}
})();