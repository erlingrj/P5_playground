var w,h,x_min,y_min,x_max,y_max
var slider_hue, slider_sat;
var button0

var maxiter =50;
w = 5;


function setup(){
  createCanvas(windowWidth,windowHeight)
  noLoop()
  colorMode(HSB)

  h = w * windowHeight/windowWidth;
  x_min = -w/2;
  y_min = -h/2;
  x_max = w/2;
  y_max = h/2;

  button0 = createButton('Zoom out')

}

function draw() {
  console.log(x_max,x_min,h,w)
  for (var i = 0; i<width; i= i+1) {
    for (var j = 0; j<height; j= j+1){
      [x_pos, y_pos] = get_coordinate(i,j)

      stroke(255-map((mandel(x_pos,y_pos)),0,maxiter,0,255),100,100);
      point(i,j)
    }
  }
}


function mousePressed() {
  if (mouseButton == LEFT) {

    h = h/2;
    w = w/2;
    [mX, mY] = get_coordinate(mouseX,mouseY);
    x_max = mX + w;
    x_min = mX - w;
    y_min = mY-h;
    y_max = mY+h
  }
  else if (mouseButton == RIGHT) {
    h = h*2;
    w = w*2;
    [mX,mY] = get_coordinate(mouseX,mouseY);
    x_min = mX - w;
    x_max = mX + w;
    y_min = mY - h;
    y_max = mY + h;
  }
  redraw()
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = h * windowWidth/windowHeight;
  redraw()
}

function mandel(x,y){
  var z1 = 0.0;
  var z2 = 0.0;
  for (var i = 0; i<maxiter; i=i+1) {
    var xx = z1 * z1;
    var yy = z2 * z2;
    var twoxxyy = 2.0 * z1 * z2;

    z1 = xx - yy + x;
    z2 = twoxxyy - y;

    if (length(z1,z2) > 4.0) {
      return i
    }

  }

  return 0
}

function length(z1, z2){
  return Math.sqrt(z1*z1 + z2*z2)
}



function get_coordinate(x_pos, y_pos) {
  x = x_min + (x_max - x_min)*x_pos/width;
  y = y_min + (y_max - y_min)*y_pos/height;
  return [x,y]
}
