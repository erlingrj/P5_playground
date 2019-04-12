/* Second try on the keyboard, trying to use object oriented programming */
// Global variables:

//Width and height for w&b keys
var wkey_w = 40;
var wkey_h= 120;
var bkey_w = 30;
var bkey_h = 65;

//whitspace padding i.e. where is the top left corner of the synth?
var padding_left = 100;
var padding_top = 100;

//Frequencies associated with each key
var freqs = [130.81,138.59,146.83,155.56,164.81,174.61,185.00,196.00,207.65,220.00,233.08,246.94,261.626,277.183, 293.665,311.127,329.628,349.228,391.995,396.994,415.305,440,466.164,493.883,523.25]

//Changed my mind about the frequencies and have moved an octave up
for (var i = 0; i<freqs.length; i++) {
  freqs[i] *= 2;
}

var amp = 0.1; //default amplitude of the oscillator
//Letters connected to each key
var letters = ["A","W","S","E","D","F","T","G","Y","H","U","J","K","O","L","P","Ø","Æ","8","@","9",",","0",".","-"];

//ASCII keycode connected to each key(and letter)
var keycodes = [65,87,83,69,68,70,84,71,89,72,85,74,75,79,76,80,59,222,56,64,57,188,48,190,173];

//White/Black keys
var whites = [true,false,true,false,true,true,false,true,false,true,false,true,true,false,true,false,true,true,false,true,false,true,false,true,true];

//The actual keyboard variable.
var synth = new Synth()

//Some variables.
var key,width,height


function setup (){
  let w = 0; //Just to keep track of whites and blacks to make
  let b = 0; // it easier to draw them correctly

  /* This is the initialization of the key objects. This is quite messy
  but I have yet to find an elegant way to find the coordinates of the
  keys.
  */
  for (var i = 0; i<freqs.length; i++){
    if (whites[i]) {
      key = new Key(freqs[i],amp,letters[i],keycodes[i],w*wkey_w+padding_left,padding_top, true);
      w = w + 1;
    }
    else {
      if (b<2) {
        key = new Key(freqs[i],amp,letters[i],keycodes[i],(b+1)*wkey_w-bkey_w/2+padding_left,padding_top,false)
      }
      else if (b >= 2 && b < 5) {
        key = new Key(freqs[i],amp,letters[i],keycodes[i],(b+2)*wkey_w-bkey_w/2+padding_left,padding_top,false)
      }

      else if (b >= 5 && b < 7) {
        key = new Key(freqs[i],amp,letters[i],keycodes[i],(b+3)*wkey_w-bkey_w/2+padding_left,padding_top,false)
      }

      else if (b >= 7 && b < 10) {
        key = new Key(freqs[i],amp,letters[i],keycodes[i],(b+4)*wkey_w-bkey_w/2+padding_left,padding_top,false)
      }

      b = b + 1;
    }
    synth.add_key(key); //Pushing the key to the synth object.
  }

  createCanvas(windowWidth, windowHeight)
  background(220)
  synth.draw()
  console.log(synth)
}

function draw() {
  //No need for anything here yet.
}


/* EVENTS */
function keyPressed(){
  console.log("")
  let i = keycodes.indexOf(keyCode) //Find the index of the pressed key
  if (i>=0) {// If valid key
    if(!synth.keys[i].on) { //Check if already playing
      synth.keys[i].on = true;
      synth.keys[i].osc.start()
    }
  }
  synth.draw()
}

function keyReleased(){
  for (var i = 0; i<synth.keys.length; i++) {
    if (!keyIsDown(keycodes[i])) {
      if (synth.keys[i].on) {
        synth.keys[i].on = false;
        synth.keys[i].osc.stop()
      }
    }
  }
  synth.draw()

}


/* CLASSES */

// A class for each key
/* This should probably be formulated such that the key doesnt
neccesarily map to an Oscillator, but could be sample from the drum
machine or any sound. */
function Key(freq,amp amplitude = 0.5 ,letter,code,posX,posY,isWhite) {
  this.osc = new p5.SinOsc(freq)
  this.osc.amp(amplitude)
  this.letter = letter; //letter connected to key
  this.code = code //ascii-code of that letter
  this.posX = posX
  this.posY = posY //coordinate of top left corner of key
  this.on = false;
  this.isWhite = isWhite;
}


//Draw the key
Key.prototype.draw = function() {
  strokeWeight(1);
  stroke(0);
  if(this.isWhite) {
    width = wkey_w;
    height = wkey_h;
    if (this.on) {fill(200)} else {fill(255)}
  }
  else { //if black
    width = bkey_w;
    height = bkey_h;
    if (this.on) {fill(100)} else {fill(0)}
  }
  //Draw the actual key
  rect(this.posX,this.posY,width,height,4)

  //Write letter ontop
  if (this.isWhite) {fill(0)} else {fill(255)} //pick colour

  textSize(16);
  text(this.letter,this.posX+width/3,this.posY+height-10)
}

// A class for the synth
function Synth() {
  this.keys = []
  this.effects = []
  // Add more stuff here?
}

// Add new key object
Synth.prototype.add_key = function(key){
  this.keys.push(key)
}

// Draw the synth
Synth.prototype.draw = function() {
  // We need to draw the white keys first, because the black keys are
  // on top of the white ones.
  for (var i = 0; i<this.keys.length; i++) {
    if (this.keys[i].isWhite) {
      this.keys[i].draw();
    }
  }
  for (var i = 0; i<this.keys.length; i++) {
    if (!this.keys[i].isWhite) {
      this.keys[i].draw();
    }
  }

}
