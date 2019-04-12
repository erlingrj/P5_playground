var xspacing = 16;
var w, dx, N, yvalues, it;
var theta = 0.0;
var amplitude = 75.0;
var period = 500.0;

function setup() {
  it = 0
  createCanvas(710,400);
  w = width + 16;
  dx = (TWO_PI/period) * xspacing
  N = floor(w/xspacing)
  yvalues = new Array(N)
  background(0)
  frameRate(15)

  for (var i = 0; i<N; i++) {
    yvalues[i] = sin(dx * i);
  }

}

function draw() {
  background(100,100,100)
  it = it +dx;
  if (it > TWO_PI) {
    it = 0;
  }

  for (var i = 0; i<N; i++) {
    fill(i,255,255)
    ellipse(i*xspacing, height/2 +100 * sin(it+i*0.1),16,16);
  }

}
