function setup() {
  createCanvas(1080, 400);
}

var mode =  1
function draw() {
  if (mode == 1) {
    ellipse(mouseX, mouseY, 80, 80);
  } else if (mode == 2) {
    triangle(mouseX, mouseY, mouseX - 40, mouseY - 40, mouseX+40, mouseY+40);
  }

}

function mousePressed() {
  mode = mode + 1;
  mode = mode % 3
}