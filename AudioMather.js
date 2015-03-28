var AudioMather = function( analyser ){
	this.analyser = analyser;
	this.nyquist = analyser.context.sampleRate/2;
	
	this.timeCap = analyser.fftSize;
	this.timeDomain = new Uint8Array(this.timeCap);
	
	this.frequencyCap = analyser.frequencyBinCount;
	this.frequencyDomain = new Uint8Array(this.frequencyCap);
};
AudioMather.prototype.getFrequencyDomain = function(){
	this.analyser.getByteFrequencyData(this.frequencyDomain);
	return this.frequencyDomain;
};
AudioMather.prototype.getTimeDomain = function(){
	this.analyser.getByteTimeDomainData(this.timeDomain);
	return this.timeDomain;
};