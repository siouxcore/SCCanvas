SCCanvas is a tiny framework for HTML5 canvas in JavaScript
-----------------------------------------------------------

The main goal of **SCC** is to provide an easy way to manipulate visual objects into a canvas.
The event detection is in charge of the framework, you only need to implement an individual behavior with event functions into your objects.
When **SCC** will detect an event, it will find the object impacted and launch its corresponding event function if it is defined. This allows to refresh the context only if necessary.

Init
---

(more parameters for canvas setting available soon)

```javascript
var param_init = {
  id: "id-canvas",
  width: 600,
  height: 400,
  millisec: 10
};
SCC.init(param_init);
```

Creating and adding objects
---

Once you've initiated **SCC**, you can add objects ; one by one or with an array.
If you want them to react to mouse events, you need to define a *mask* or to implement an *intersect* function. The mask will also be used by a defaultDraw function if you don't want to implement your own *draw* function. Here is a list of attributes and functions you can use : 

- id (string - not necessary) : will allow you to find your objects later, will be generated by SCC if it doesn't exist
- z (number - not necessary) : depth of your object, useful for the rendering, 0 if not exists
- mask (object or array or function - not necessary) : an array of {x,y} for a polygon mask or {radius:number, center: {x,y}} for a circle mask or a function returning them, also useful for default drawing
- intersect (function({x,y}) - not necessary) : a function to detect an intersection with the mouse, must return a boolean
- draw (function(context) - not necessary) : drawing method
- fill (string - not necessary) : useful for default drawing method
- stroke (string - not necessary) : useful for default drawing method
- strokeWeight (number - not necessary) : useful for default drawing method

The add method uses a single param object, the attribute for your single object or your array of objects is <i>elt</i>. You can also specify a new rendering after adding object(true by default) with the render attribute : 

```javascript
param_add = {elt: myDatas};
SCC.add( param_add );
```
Thanks to chaining pattern, you can use **SCC** like this : 

```javascript
SCC.init(param_init).add(param_add).bang("grow");
```

Event functions
---

There is a set of event functions you can implement into your objects : 

- click
- rclick : right click
- cclick : center click
- mousein
- mouseout
- drag
- release
- custom events : your can implement your own event function and launch it thanks to the SCC.bang method :

 ```javascript
 SCC.bang({event: "your event name", id: "object-id"})
 ```
 if the id is not defined in the bang parameter object, the event will   be launch for all objects implementing the event function.


Available event functions parameters and return mechanism
---

the only parameter you can use is *step*, the number of executions of your current event function since the event detection.
The animation manager will continue to call it while it return true : 

```javascript
click: function(){
  this.color = 'black';
}
```

The first function will be executed just one time

```javascript
mousein: function(s){
  this.mask.radius += 1;
  return s < 20;
}
```

The second function will be executed 20 times, so the radius of the object will grow during 20 * SCC.millisec

Finding and deleting objects
---

TODO

Other SCC attributes and functions
---

TODO

- mouseX
- mouseY
- numrend
- millisec

Additional util library
---

SCUtil is a tiny util lib in JavaScript and inspired by processing & processing.js utilities

List of functions : 

- map : map function
    * @value : val
    * @istart : original start
    * @istop : original end
    * @ostart : projected start
    * @ostop : projected end
- stepin : is a map function with a style function parameter : allowing you to smooth your projection, check @ http://dev.siouxcore.com/Animfunk
    * @step : current step
    * @fisrtstep : startint step
    * @finalstep : final step
    * @startval : start value
    * @stopval : final value
    * @style : (not necessary) normalized function for non linear progression
- constrain
- dist
- norm
- max
- min
- intersect : intersect function between a point and (a polygon or a circle)
    * @point : {x, y}
    * @shape : polygon [ {x, y}, ... ] or circle 
- random
- rotate : 
    * @arg0 : a point or an array of point to rotate
    * @arg1 : angle in radian
    * @arg2 : (not necessary) point, center of rotation, (0,0) if not specified
- translate
    * @elt : point or an array of point
    * @vec : vector of translation

Additional drawing library
---

TODO

License
---

SCCanvas is licensed under the MIT license

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

