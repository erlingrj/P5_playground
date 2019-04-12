var yoff = 0.0; //2nd dimension perlin noise

function setup() {
  createCanvas(710,400);
}



function draw () {
  background(51);

  fill(255);
  // We will draw a polygon of the wave points

  beginShape();

  var xoff = 0;        // Option #1: 2D noise
  // var xoff = yoff;  // Option #2: 1D noise


  // Iterate over horizontal pixels
  for (var x = 0; x <= width; x += 10) {
    // Calculate a y value according to noise

    // Option 1: Map to 2D Noise
    var y = map(noise(xoff,yoff),0,1,200,300);

    // Option 2: Map to 1D Noise:
    // var y = map(noise(xoff),0,1,200,300);

    // Set the vertex
    vertex(x,y);

    //Increment x dimension for Noise
    xoff += 0.02;
  }
  yoff  +=0.01
  vertex(width, height)
  vertex(0,height)

  endShape(CLOSE)


}
