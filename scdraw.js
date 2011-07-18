/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCDraw is a tiny drawing lib in JavaScript for HTML5 canvas - siouxcore@gmail.com
* SCDraw is under MIT license
* version : 0.1.20110718.1
* change : first version
**/
(function (){
  // SCDraw
  var SCDraw = {
    f: true,
    s: true,
    c: undefined,
    init: function(arg){
      this.c = arg.context;
      return this;
    },
    render: function(){
      if(this.f){
        this.c.fill();
      }
      if(this.s){
        this.c.stroke();
      }
    },
    /**
    * @mask : array of points
    **/
    polygon: function(arg){
      this.c.beginPath();
      for(var i = 0; i < arg.mask.length; i++){
        this.c.lineTo(arg.mask[i].x, arg.mask[i].y);
      }
      this.c.closePath();
      this.render();
    },
    /**
    * @center
    * @radius1 : by default 0
    * @radius2
    * @angle1 : by default 0
    * @angle2 : by default 2*PI
    * @ccw : by default true
    **/
    arc: function(arg){
      var center = arg.center;
      var radius1 = typeof arg.radius1 === 'number' ? arg.radius1 : 0;
      var radius2 = arg.radius2;
      var angle1 = typeof arg.angle1 === 'number' ? arg.angle1 : 0;
      var angle2 = typeof arg.angle2 === 'number' ? arg.angle2 : 2 * Math.PI;
      var ccw = typeof arg.ccw === 'boolean' ? arg.ccw : true;
      
      this.c.beginPath();
      this.c.arc(center.x, center.y, radius2, angle1,angle2,ccw);
      this.c.lineTo(center.x + Math.cos(angle2) * radius1,center.y + Math.sin(angle2) * radius1);
      this.c.arc(center.x,center.y,radius1,angle2,angle1,!ccw);
      this.c.closePath();
      this.render();
    },
    /**
    * @point
    * @width
    * @height
    **/
    rectangle: function(arg){
      this.polygon([
        {x: arg.point.x, y: arg.point.y},
        {x: arg.point.x + arg.width, y: arg.point.y},
        {x: arg.point.x + arg.width, y: arg.point.y + arg.height},
        {x: arg.point.x, y: arg.point.y + arg.height},
      ]);
    },
    /**
    * @point1
    * @point2
    **/
    line: function(arg){
      this.polygon([
        arg.point1,
        arg.point2
      ]);
    },
    /**
    * @style
    **/
    fill: function(arg){ // "rgba(255, 255, 0, .5)"
      this.f = true;
      this.c.fillStyle = arg.style;
    },
    /**
    * @style
    * @weight
    **/
    stroke: function(arg){
      this.s = true;
      this.c.strokeStyle = arg.style;
      if(weight){
        this.c.lineWidth = arg.weight;
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
    strokeWeight: function(arg){
      this.c.lineWidth = arg.weight;
    }   
  };
  // shortcut
  if(!window.SCD){window.SCD = SCDraw;}
})();