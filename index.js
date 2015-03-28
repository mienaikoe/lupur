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
	
	// Actual recording
	var rec = new Recorder(mic, {
      workerPath: 'recorder/recorderWorker.js'
    });


	var running = false;
	var loopNodes = [];
	var targetLength = null;


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
		content.html(loopNodes.length);
	}

	var content = $(".flasher");

	function start(){
		// start recording
		rec.record();
		running = true;
		flash("green");
	}
	
	function next(){
		rec.stop();
		rec.getBuffer(getBufferCallback);
		rec.clear();
		rec.record();
		//mic.disconnect();
		flash("blue");
	}
	
	function stop(){
		running = false;
		rec.stop();
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
	}
	
	function flash(color){
		content.
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
		
		
		
		requestAnimationFrame(frame);
	}
	
	requestAnimationFrame(frame);
	

},function(){});




