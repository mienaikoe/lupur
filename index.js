fm=65536;fh=fm/2;d=document;d.b=d.body;c=new AudioContext();M=Math;w=window;
c._G=c.createGain;c._F=c.createBiquadFilter;c._W=c.createWaveShaper;hx=[];ox=[];
anp=AudioNode.prototype;anp.c=anp.connect;n=navigator;n.getUserMedia=
(n.getUserMedia||n.webkitGetUserMedia||n.mozGetUserMedia||n.msGetUserMedia);
n.getUserMedia({audio:true},function(str){mic=c.createMediaStreamSource(str);
for(i=65;i<91;i++){oz=c.createOscillator();oz.type='sawtooth';oz.start();
oz.frequency.value=4*M.pow(2,i/12);z=c._G();z.gain.value=0;oz.c(z);ox[i]=z;
hb=d.createElement("div");hv=hb.style;d.b.appendChild(hb);hx[i]=hv;
hv.opacity=0;hb.innerHTML=String.fromCharCode(i);}d.b.style.height="100%";
cv=new Float32Array(fm);for(i=-fh;i<fh;i++){cv[i+fh]=Math.max(i<0?-i:i,0.2)/fh;}
for(i=0;i<40;i++){fr=20*M.pow(2,i/4);mb=c._F();mb.type="bandpass";mic.c(mb);
mb.frequency.value=fr;mr=c._W();mr.curve=cv;mf=c._F();mf.type='LOWPASS';
ob=c._F();ob.type="bandpass";mf.frequency.value=fr/50;ob.frequency.value=fr;
g=c._G();g.gain.value=0;mb.c(mr);mr.c(mf);mf.c(g.gain);mb.Q.value=8;
for(ix in ox){ox[ix].c(ob);}ob.c(g);g.c(c.destination);}w.a=w.addEventListener;
function et(v){return function(ev){_=ev.keyCode;if(_>64 && _<91){
ox[_].gain.value=v;hx[_].opacity=v;}};};w.a("keydown",et(0.5));
w.a("keyup",et(0));},function(){});d.b.style.fontFamily='Verdana, sans-serif';
d.b.innerHTML="<p style='margin:9% 1%;float:right;clear:both;font-size:32px;'>"+
"Press a Key and Sing like a robot!</p>";





n=navigator;
n.getUserMedia= (n.getUserMedia||n.webkitGetUserMedia||n.mozGetUserMedia||n.msGetUserMedia);
n.getUserMedia( {audio: true}, function(liveStream){
	var ctx = new AudioContext();
	var mic = ctx.createMediaStreamSource(liveStream);
	
	
	
});




