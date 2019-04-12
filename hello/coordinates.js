function setup() {
  //Sets the screen to 720x400
  createCanvas(720,400)
}

function draw(){
  //Set the background to black and turn off the fill color
  background(0);
  noFill();

  // The two paramters of the point() method each specify coordinates

  stroke(255);
  point(width * 0., height*0.5);
  point(width * 0.5, height * 0.25);

  stroke(0,153,255);
  line(0, height*0.33, mouseY, mouseX);

  stroke(255,153,0);
  rect(width*0.25,height*0.1, width*0.5, height*0.8)
}
