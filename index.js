n=navigator;
n.getUserMedia= (n.getUserMedia||n.webkitGetUserMedia||n.mozGetUserMedia||n.msGetUserMedia);
n.getUserMedia( {audio: true}, function(liveStream){
	var ctx = new AudioContext();
	var mic = ctx.createMediaStreamSource(liveStream);
	
	// TODO: Compressor
	mic.connect(ctx.destination);

	// Mather
	var analyser = ctx.createAnalyser();
	analyser.fftSize = 256;
	mic.connect(analyser);
	var mather = new AudioMather(analyser);
	mic.connect(analyser);
	
	// Actual recording
	var rec = new Recorder(mic, {
      workerPath: 'recorder/recorderWorker.js'
    });


	var running = false;
	var loopNodes = [];
	var targetLength = null;
	var targetDuration = null;
	
	var currentLoop = 0;
	
	var startTime = 0;
	var frameTime = 0;


	function getBufferCallback( buffers ) {		
		if( buffers[0].length === 0 ){
			return;
		}
		
		if(targetLength){
			var bufferLength = buffers[0].length;
			if( bufferLength < targetLength ){
				for( var i in buffers ){
					var newBuffer = new Float32Array(targetLength);
					newBuffer.set(buffers[i]);
					buffers[i] = newBuffer;
				}
			} else if( bufferLength > targetLength ){
				for( var i in buffers ){
					buffers[i] = buffers[i].subarray(0, targetLength);
				}
			}
		} else {
			targetLength = buffers[0].length;
			targetDuration = targetLength / ctx.sampleRate;
		}
		
		var newSource = ctx.createBufferSource();
		var newBuffer = ctx.createBuffer( 2, buffers[0].length, ctx.sampleRate );
		newBuffer.getChannelData(0).set(buffers[0]);
		newBuffer.getChannelData(1).set(buffers[1]);
		newSource.buffer = newBuffer;
		newSource.loop = true;
		newSource.connect( ctx.destination );
		newSource.start(0);
		
		loopNodes.push(newSource);
	}

	var flasher = $("#flasher");

	function start(){
		// start recording
		startTime = frameTime;
		rec.record();
		
		$("<div/>",{"class":"loop","id":"loop-"+currentLoop}).appendTo($(".loops"));
		
		
		running = true;
		flash("green");
	}
	
	function next(){
		rec.stop();
		rec.getBuffer(getBufferCallback);
		rec.clear();
		
		startTime = frameTime;
		
		currentLoop++;
		$("<div/>",{"class":"loop","id":"loop-"+currentLoop}).appendTo($(".loops"));
		
		
		rec.record();
		//mic.disconnect();
		flash("blue");
	}
	
	function stop(){
		running = false;
		rec.stop();
		currentLoop++;
		rec.getBuffer(getBufferCallback);
		rec.clear();
		flash("red");
	}
	
	function clear(){
		stop();
		loopNodes.forEach(function(node){
			node.disconnect();
		});
		loopNodes = [];
		targetLength = null;
		targetDuration = null;
	}
	
	function flash(color){
		flasher.
				css("background-color",color).
				css("opacity", 1).
				animate({"opacity" : 0}, 1000);
	}
	
	$(document).on("keydown", function(ev){
		console.log(ev.which);
		if( ev.which === 17 ){
			stop();
		} else if( ev.which === 27 ){
			clear();
		} else if( ev.which === 32 ){
			if( running ){
				next();
			} else {
				start();
			}
		}
	});
	
	
	function frame(time){
		frameTime = time;
		
		var sum = 0;
		var timedo = mather.getTimeDomain();
		
		for( var i in timedo ){
			sum += timedo[i];
			// all 128 console.log(timedo[0]);
		}
		var perc = ((sum / mather.getTimeDomain().length) / 255) * 100;
		
		var leftiness = (((frameTime - startTime) / 1000) / targetDuration) * 640;
		
		$("<div/>", {
			"class":"thin",
			style:"height:"+perc+"%; left: "+leftiness+"px"
		}).appendTo( $("#loop-"+currentLoop) );
		
		requestAnimationFrame(frame);
	}
	
	requestAnimationFrame(frame);
	

},function(){});




$(document).ready(function(){

	var backgrounds = [
		'http://imageserver.moviepilot.com/-c71b976e-866b-452f-a118-4d69d8a2bc2c.jpeg?width=1920&height=1080',
	'http://x.annihil.us/u/prod/marvel/i/mg/6/60/538cd3628a05e.jpg',
	'http://static.comicvine.com/uploads/original/11118/111181824/4000987-7935602615-batma.jpg',
	'http://www.destroythecyb.org/wp-content/uploads/2014/01/BatmanBWRivera.jpg',
	'http://media.dcentertainment.com/sites/default/files/GalleryChar_1920x1080_BM_Cv38_54b5d0d1ada864.04916624.jpg',
	'bg2.jpg'
];
	
	var background = backgrounds[ Math.floor(Math.random()*backgrounds.length) ];

	$("#content").css("background-image","url("+background+")");
});



