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



	function getBufferCallback( buffers ) {
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

	var content = $("#content");

	function start(){
		content.
				css("background-color","green").
				css("opacity", 1).
				animate({"opacity" : 0}, 1000);
		// start recording
		rec.record();
		running = true;
	}
	
	function next(){
		rec.stop();
		rec.getBuffer(getBufferCallback);
		rec.clear();
		rec.record();
		//mic.disconnect();
	}
	
	function stop(){
		content.
				css("background-color","red").
				css("opacity", 1).
				animate({"opacity" : 0}, 1000);
		running = false;
		rec.stop();
		rec.getBuffer(getBufferCallback);
		rec.clear();
	}
	
	
	$(document).on("keydown", function(ev){
		if( ev.which === 32 ){
			if( running ){
				stop();
			} else {
				start();
			}
		}
	});

	$(document).on("click", function(ev){
			if( running ){
				stop();
			} else {
				start();
			}
	});

},function(){});




