/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCUtil is a tiny util lib in JavaScript and inspired by processing & processing.js - siouxcore@gmail.com
* SCUtil is under MIT license
* version : 0.1.20110711.1
* change :  intersection function : 2 functions merged in one
*           linear : deleted and deported into animfunc.js
*           stepin : correction for style function
**/
(function (){

  // SCUtil
  var SCUtil = {
    map: function(value, istart, istop, ostart, ostop){
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    },
    stepin: function(step, firststep, finalstep, startval, stopval, style){
      return typeof style === 'function' 
      ? this.map(style( this.norm(step, firststep, finalstep) ), 0, 1, startval, stopval ) 
      : this.map(step, firststep, finalstep, startval, stopval);
    },
    constrain: function(aNumber, aMin, aMax){
      return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
    },
    dist: function(){
      var dx, dy;
      dx = arguments[0].x - arguments[1].x;
      dy = arguments[0].y - arguments[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    norm: function(aNumber, low, high){
      return (aNumber - low) / (high - low);
    },
    max: function(){
      if (arguments.length === 2) {
        return arguments[0] < arguments[1] ? arguments[1] : arguments[0];
      } else {
        var numbers = arguments.length === 1 ? arguments[0] : arguments; // if single argument, array is used
        if (! ("length" in numbers && numbers.length > 0)) {
          throw "Non-empty array is expected";
        }
        var max = numbers[0],
          count = numbers.length;
        for (var i = 1; i < count; ++i) {
          if (max < numbers[i]) {
            max = numbers[i];
          }
        }
        return max;
      }
    },
    min: function(){
      if (arguments.length === 2) {
        return arguments[0] < arguments[1] ? arguments[0] : arguments[1];
      } else {
        var numbers = arguments.length === 1 ? arguments[0] : arguments; // if single argument, array is used
        if (! ("length" in numbers && numbers.length > 0)) {
          throw "Non-empty array is expected";
        }
        var min = numbers[0],
          count = numbers.length;
        for (var i = 1; i < count; ++i) {
          if (min > numbers[i]) {
            min = numbers[i];
          }
        }
        return min;
      }
    },
    /**
    * point : {x, y}
    * shape : polygon [ {x, y}, ... ] or circle 
    */
    intersect: function(point, shape){
      // polygon mask
      if(Object.prototype.toString.apply(shape) === '[object Array]'){
        var c = false;
        var j = shape.length - 1;
        for(var i = 0; i < shape.length; j = i++){
          if ((((shape[i].y <= point.y) && (point.y < shape[j].y)) ||
               ((shape[j].y <= point.y) && (point.y < shape[i].y))) &&
              (point.x < (shape[j].x - shape[i].x) * 
              (point.y - shape[i].y) / (shape[j].y - shape[i].y) + shape[i].x))
            c = !c;
        }
        return c;
      } else {
        return (this.dist(point.x, point.y, circle.centre.x, circle.center.y) <= circle.radius); 
      }
    },
    random: function(){
      if(arguments.length === 0) {
        return Math.random();
      } else if(arguments.length === 1) {
        return Math.random() * arguments[0];
      } else {
        var aMin = arguments[0], aMax = arguments[1];
        return Math.random() * (aMax - aMin) + aMin;
      }
    },
    rotate: function(){
      var point = arguments[0];
      var angle = arguments[1];
      var center = {x: 0, y: 0};
      arguments[2] && (center = arguments[2]);
      var xr = point.x - center.x;
      var yr = point.y - center.y;      
      return {
        x: (xr * Math.cos(angle) - yr * Math.sin(angle)) + center.x,
        y: (xr * Math.sin(angle) + yr * Math.cos(angle)) + center.y
      };
    },
    rotateShape: function(){
      var shape = arguments[0];
      var angle = arguments[1];	
      if(arguments[2]) var center = arguments[2];
      var ret = [];
      if(center){
        for(pt in shape){
          ret.push( this.rotate( shape[ pt ], angle, center ) );
        }		
      }else {
        for(pt in shape){
          ret.push( this.rotate( shape[ pt ], angle ) );
        }		
      }
      return ret;
    },
    translate: function(point, vec){
      return {
        x: point.x + vec.x,
        y: point.y + vec.y
      };	
    },
    translateShape: function(shape, vec){
      var ret = [];
      for(pt in shape){
        ret.push( this.translate( shape[ pt ], vec ) );
      }
      return ret;
    }
  };
  // shortcut
  if(!window.SCU){window.SCU = SCUtil;}
})();