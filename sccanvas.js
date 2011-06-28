/**
 * 
 */

(function (){
	//Creating our framework named SCCanvas 
	var SCCanvas = {
		canvas: {},
		context: {},
		framerate: 0,
		elements: [],
		eventqueue: {
			click: {},
			rightclick: {},
			middleclick: {},
			mousein: {},
			mouseout: {},
			dragg: {},
			release: {},
			keypressed: {},
			keyreleased: {}
		}
	};
	if(!window.SCC){window.SCC = SCCanvas;}
})();