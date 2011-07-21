/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCDraw is a tiny drawing lib in JavaScript for HTML5 canvas - siouxcore@gmail.com
* SCDraw is under MIT license
* version : 0.2.20110721.1
* change : v0.2 : custom shorten var name added
*                 parameters
*                 donut & circle functions
*                 rectangle heigth param non necessary
**/
(function (){
  // SCDraw
  var SCDraw = {
    f: true,
    s: true,
    c: undefined,
    init: function(context){
      this.c = context;
      return this;
    },
    render: function(){
      if(this.s){
        this.c.stroke();
      }    
      if(this.f){
        this.c.fill();
      }
    },
    /**
    * @mask : array of points
    **/
    polygon: function(mask){
      this.c.beginPath();
      for(var i = 0; i < mask.length; i++){
        this.c.lineTo(mask[i].x, mask[i].y);
      }
      this.c.closePath();
      this.render();
    },
    /**
    * @center
    * @r1 
    * @r2
    * @a1 
    * @a2 
    * @ccw : by default true
    **/
    arc: function(center, r1, r2, a1, a2, ccw){
      var rot = typeof ccw === 'boolean' ? ccw : true;
      this.c.beginPath();
      this.c.arc(center.x, center.y, r2, a1,a2,rot);
      this.c.lineTo(center.x + Math.cos(a2) * ra1,center.y + Math.sin(a2) * r1);
      this.c.arc(center.x,center.y,r1,a2,a1,!rot);
      this.c.closePath();
      this.render();
    },
    /**
    * @center
    * @r1 
    * @r2
    **/
    donut: function(center, r1, r2){
      this.arc(center, r1, r2, 0, Math.PI*2);
    },
    /**
    * @center
    * @radius
    **/
    circle: function(center, radius){
      this.arc(center, 0, radius, 0, Math.PI*2);
    },
    /**
    * @point
    * @width
    * @height = width if not specified
    **/
    rectangle: function(point, width, height){
      var h = typeof height !== 'undefined' ? height : width;
      this.polygon([
        {x: point.x, y: point.y},
        {x: point.x + width, y: point.y},
        {x: point.x + width, y: point.y + h},
        {x: point.x, y: point.y + h},
      ]);
    },
    /**
    * @pt1
    * @pt2
    **/
    line: function(pt1, pt2){
      this.polygon([pt1,pt2]);
    },
    /**
    * @style
    **/
    fill: function(style){ // "rgba(255, 255, 0, .5)"
      this.f = true;
      this.c.fillStyle = style;
    },
    /**
    * @style
    * @weight
    **/
    stroke: function(style, weight){
      this.s = true;
      this.c.strokeStyle = style;
      if(typeof weight === 'number'){
        this.c.lineWidth = weight;
      }
    },
    /**
    *
    **/
    noStroke: function(){
      this.s = false;
    },
    noFill: function(){
      this.f = false;
    },
    /**
    * @weight
    **/
    strokeWeight: function(weight){
      this.c.lineWidth = weight;
    }   
  };
  // shortcut
  if(shortenSCDraw && !window[shortenSCDraw]){window[shortenSCDraw] = SCDraw;}
  else{ window.SCD = SCDraw;}
})();