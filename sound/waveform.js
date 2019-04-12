var tones = []
var osc, fft, iter;


function setup() {
  createCanvas(720,440);
  osc = new p5.TriOsc();
  osc.amp(.5);

  fft = new p5.FFT();
  osc.start()
  osc.freq(40)

  colorMode(HSB,100);
  iter = 0;
}

function draw() {
  osc.freq(map(mouseX,0,width,40,880))
  osc.amp(map(mouseY,0,height,1,0.01));

  background(255);
  var waveform = fft.waveform();
  strokeWeight(10)
  stroke(iter+10,100,100);

  beginShape();
  for (var i = 0; i< waveform.length; i++) {
    var x = map(i, 0, waveform.length, 0, width);
    var y = map(waveform[i],-1,1,height,0)


    vertex(x,y)
    }
    endShape();
  }







function mousePressed() {

  osc1 = new p5.TriOsc()
  osc1.freq(map(mouseX,0,width,40,880))
  osc1.amp(map(mouseY,0,height,1,0.01))
  osc1.start()
  tones.push(osc1)

  iter = iter + 13;
  if (iter > 100){
    iter = 0;
  }
}
