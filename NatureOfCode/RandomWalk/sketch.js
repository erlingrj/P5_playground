

function setup() 
{
	createCanvas(640, 360);
	walker = new Walker();
	background(127);
}

function draw()
{
	walker.step();
	walker.render();

}


class Walker {
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
		
		var rightX, rightY;
		if (mouseX > this.x) {
			rightX=1;
		} else {
			rightX=-1;
		}

		if (mouseY > this.y) {
			rightY = 1;
		} else {
			rightY = -1;
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