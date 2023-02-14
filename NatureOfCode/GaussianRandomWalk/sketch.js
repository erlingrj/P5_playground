let distribution = new Array(360);
let cnt = 0;
var walker;


function setup() 
{
	createCanvas(400, 400);
	background(127);
	walker = new WalkerGaussian();

}
function draw()
{
	walker.step()
	walker.render()

}


class WalkerGaussian {
	constructor() {
		this.x = width / 2;
		this.y = height / 2;
	}

	render() {
		stroke(1);
		point(this.x, this.y);
	}

	step() {
		var choice = random(1);
		var length = floor(randomGaussian(3, 3));
		var rightX, rightY;
		if (mouseX > this.x) {
			rightX=length;
		} else {
			rightX=-length;
		}

		if (mouseY > this.y) {
			rightY = length;
		} else {
			rightY = -length;
		}



	if (choice < 0.5) {
	      this.x += rightX
		  this.y += rightY
    } else if (choice < 0.7) {
	      this.x -= rightX
		  this.y -= rightY
    } else if (choice < 0.8 ) {
	      this.x += rightX
		  this.y -= rightY
    } else {
	      this.x -= rightX
		  this.y += rightY
    }
    this.x = constrain(this.x, 0, width - 1);
    this.y = constrain(this.y, 0, height - 1);
	}
}