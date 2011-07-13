/**
*               _/                                                                       
*      _/_/_/        _/_/    _/    _/  _/    _/    _/_/_/    _/_/    _/  _/_/    _/_/    
*   _/_/      _/  _/    _/  _/    _/    _/_/    _/        _/    _/  _/_/      _/_/_/_/   
*      _/_/  _/  _/    _/  _/    _/  _/    _/  _/        _/    _/  _/        _/          
* _/_/_/    _/    _/_/      _/_/_/  _/    _/    _/_/_/    _/_/    _/          _/_/_/      
*
* SCUtil is a tiny util lib in JavaScript and inspired by processing & processing.js - siouxcore@gmail.com
* SCUtil is under MIT license
* version : 0.1.20110713.1
* change : rotate and translate functions : the elt param can be either a point or an array of points
**/
(function (){
  // SCUtil
  var SCUtil = {
    /**
    * map function (from processing.js)
    * @value : val
    * @istart : original start
    * @istop : original end
    * @ostart : projected start
    * @ostop : projected end
    **/
    map: function(value, istart, istop, ostart, ostop){
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    },
    /**
    * stepin function, used for animation
    * is a map function with a style function parameter : allowing you to smooth your projection, check @ dev.siouxcore.com/animfunc
    * @step : current step
    * @fisrtstep : startint step
    * @finalstep : final step
    * @startval : start value
    * @stopval : final value
    * @style : (not necessary) normalised function for non linear progression
    **/
    stepin: function(step, firststep, finalstep, startval, stopval, style){
      return typeof style === 'function' 
      ? this.map(style( this.norm(step, firststep, finalstep) ), 0, 1, startval, stopval ) 
      : this.map(step, firststep, finalstep, startval, stopval);
    },
    /**
    * constrain function (from processing.js)
    * @aNumber : val
    * @aMin : min 
    * @aMax : max
    **/
    constrain: function(aNumber, aMin, aMax){
      return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
    },
    /**
    * dist function (from processing.js)
    **/
    dist: function(){
      var dx, dy;
      dx = arguments[0].x - arguments[1].x;
      dy = arguments[0].y - arguments[1].y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    /**
    * norm function (from processing.js)
    **/
    norm: function(aNumber, low, high){
      return (aNumber - low) / (high - low);
    },
    /**
    * max function (from processing.js)
    **/
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
    /**
    * min function (from processing.js)
    **/
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
    * intersect function between a point and (a polygon or a circle)
    * @point : {x, y}
    * @shape : polygon [ {x, y}, ... ] or circle 
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
    /**
    * random function (from processing.js)
    **/
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
    /**
    * rotate function
    * @arg0 : a point or an array of point
    * @arg1 : angle in radian
    * @arg2 : (not necessary) point, center of rotation, (0,0) if not specified
    **/
    rotate: function(){
      var elt = arguments[0];
      if(Object.prototype.toString.apply(elt) === '[object Array]'){
        for(ind in elt){
          elt[ ind ] = this.rotate( elt[ ind ], 
                arguments[1], 
                arguments[2] ? arguments[2] : {x: 0, y: 0} );
        }
        return elt;
      } else {
        var angle = arguments[1];
        var center = {x: 0, y: 0};
        arguments[2] && (center = arguments[2]);
        var xr = elt.x - center.x;
        var yr = elt.y - center.y;      
        return {
          x: (xr * Math.cos(angle) - yr * Math.sin(angle)) + center.x,
          y: (xr * Math.sin(angle) + yr * Math.cos(angle)) + center.y
        };      
      }
    },
    /**
    * translate function 
    * @elt : point or an array of point
    * @vec : vector of translation
    **/
    translate: function(elt, vec){
      if(Object.prototype.toString.apply(elt) === '[object Array]'){
        for(ind in elt){
          elt[ ind ] = this.translate( elt[ ind ] );
        }
        return elt;
      } else {
        return {
          x: elt.x + vec.x,
          y: elt.y + vec.y
        };	
      }
    }
  };
  // shortcut
  if(!window.SCU){window.SCU = SCUtil;}
})();