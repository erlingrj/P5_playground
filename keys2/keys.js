/*
TODO: Requires ALOT of CPU to process everything. Not sure why. Also can only pressed
4 keys down at the same time.
1. Investigate how to reduce CPU load
2. Why doesn't the keyPressed register more than 4?
3. Redo the whole thing. Create a new class that contains all the relevant information
This is too dirty.
*/


var wkeys = []; //array for white keys
var bkeys = []; //array for black keys

//Frequencies associated with each key
var wfreq = [261.626, 293.665,329.628,349.228,391.995,440, 493.883,523.251,587.330,659.255,698.456,783.991,880,987.767,1046.50];
var bfreq = [277.183,311.127,396.994,415.305,466.164,554.365,622.254,739.989,830.609,932.328];

//Letters connected to each key
var wletters = ["A","S","D","F","G","H","J","K","L","Ø","Æ","@",",",".","-"];
var bletters = ["W","E","T","Y","U","O","P","8","9","0"];

//ASCII keycode connected to each key(and letter)
var wkeycode = [65,83,68,70,71,72,74,75,76,59,222,64,188,190,173]
var bkeycode = [87,69,84,89,85,79,80,56,57,48]

//Width and height for w&b keys
var wkey_w = 50;
var wkey_h= 200;
var bkey_w = 40;
var bkey_h = 100;

//whitspace padding i.e. where is the top left corner of the synth?
var padding_left = 100;
var padding_top = 100;

var WOsc = [] //Array for white-key oscillators
var BOsc = [] //Array for black-key oscillators
var osc, fft, waveform, mic, analyzer;

var numSamples = 1024;
var samples = [];

function setup() {
  getAudioContext().suspend();
  createCanvas(windowWidth,windowHeight)
  textSize(32)

  drawWkeys();
  drawBkeys();


  fft = new p5.FFT();
  mic = new p5.AudioIn();
  analyzer = new p5.FFT(0, numSamples);
  mic.start();
  analyzer.setInput(mic);

  //Generate arrays with positional info of each key
  for(var i = 0; i<15; i++){
    let key = [i*wkey_w+padding_left,padding_top,wkey_w,wkey_h];
    wkeys.push(key);
    osc = new p5.SinOsc()
    osc.freq(wfreq[i])
    osc.amp(.5)
    WOsc.push(osc)
  }

  for (var j = 0; j<2; j++){
    let key = [(j+1)*wkey_w-bkey_w/2+padding_left,padding_top,bkey_w,bkey_h];
    bkeys.push(key);
    osc = new p5.SinOsc()
    osc.freq(bfreq[j])
    BOsc.push(osc)
  }

  for (var j=0; j<3; j++){
    let key = [(j+4)*wkey_w-bkey_w/2+padding_left,padding_top,bkey_w,bkey_h];
    bkeys.push(key);
    osc = new p5.SinOsc()
    osc.freq(bfreq[j+2])
    BOsc.push(osc)
  }

  for (var j = 0; j<2; j++) {
    let key = [(j+8)*wkey_w-bkey_w/2+padding_left,padding_top,bkey_w,bkey_h];
    bkeys.push(key);
    osc = new p5.SinOsc()
    osc.freq(bfreq[j+5])
    BOsc.push(osc)
  }

  for (var j=0; j<3; j++){
    let key = [(j+11)*wkey_w-bkey_w/2+padding_left,padding_top,bkey_w,bkey_h];
    bkeys.push(key);
    osc = new p5.SinOsc()
    osc.freq(bfreq[j+7])
    BOsc.push(osc)
  }

}

function draw() {
  background(255)
  textSize(48)
  text("pop it",padding_left,padding_top-32)
  drawWkeys();
  drawBkeys();

  // get a buffer of 1024 samples over time.
  samples = analyzer.waveform();
  var bufLen = samples.length;

  noFill()
  beginShape();
  for (var i = 0; i< bufLen; i++) {
    var x = map(i, 0, bufLen, 0, width);
    var y = map(samples[i],-1,1,padding_top+wkey_h+20,height)

    vertex(x,y);
    }
  endShape();
  }



function drawKey(key,keycode,letter,i,isWhite) {
  strokeWeight(1)
  stroke(0)
  if (keyIsDown(keycode)) { //Check if the key is pressed
    if(isWhite) {
      fill(200);
    }
    else {
      fill(100);
    }
  }
  else{
    if (isWhite) {
      fill(255)
    }
    else {
      fill(0)
    }

  }

  // Draw key
  rect(key[0],key[1],key[2],key[3],2);

  // Write the appropriate letter ontop of key
  if (isWhite) {
    stroke(0);
    fill(0)
    textSize(16);
    text(letter,padding_left+i*wkey_w+wkey_w/3,padding_top+wkey_h-10)
  }
  else {
    stroke(0);
    fill(255);
    textSize(16);
    text(letter,key[0]+bkey_w/4,key[1]+bkey_h-5);
  }


}

function keyPressed() {
  var i = wkeycode.indexOf(keyCode);
  var isWhite = true
  if (i<0) {
    i = bkeycode.indexOf(keyCode);
    if (i<0) {
      return -1;
    }
    isWhite = false;
  }

  if (isWhite) {
    console.log("START")
    WOsc[i].start()
  }
  else {
    console.log(i)
    BOsc[i].start()
}
}

function keyReleased() {
  for (var i = 0; i<WOsc.length; i++) {
    if (!keyIsDown(wkeycode[i])) {
      console.log("STOPW")
      WOsc[i].stop(0.1)
    }
  }
  for (var j = 0; j<BOsc.length; j++) {
    if(!keyIsDown(bkeycode[i])) {
      console.log("STOPB")
      BOsc[j].stop(0.1)
    }
  }


}


function drawBkeys() {
  for (var i = 0; i<bkeys.length; i++) {
    drawKey(bkeys[i],bkeycode[i],bletters[i],i,false);
  }
}

function drawWkeys() {
  for (var i = 0; i<wkeys.length; i++) {
    drawKey(wkeys[i],wkeycode[i],wletters[i],i,true);
  }
}

function mousePressed() {
  userStartAudio();
}