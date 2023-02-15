let distribution = new Array(360);
let ellipseRadius = 50;
var walker;


function setup() 
{

	createCanvas(640, 360);
//	walker = new PerlinWalker2D(0.005, width, height)

	perlinBackground();
}

var t = 0;
function draw()
{
	//walker.step()
	//ellipse(walker.x, walker.y, ellipseRadius,ellipseRadius);
}

function perlinBackground() {
	loadPixels();
	let xoff = 0.0;
  
	// Updating pixels with perlin noise
	for (let x = 0; x < width; x++) {
	  let yoff = 0.0;
  
	  for (let y = 0; y < height; y++) {
		// Calculating brightness value for noise
		let bright = map(noise(xoff, yoff), 0, 1, 0, 255);
		set(x, y, floor(bright));
		yoff += 0.009; // Incrementing y-offset perlins noise
	  }
	  xoff += 0.09; // Incrementing x-offset perlins noise
	}
  
	updatePixels();
}
function randomBackground() {
	loadPixels();
	let d = pixelDensity();
	for (let i = 0; i<width*d*d*4; i++) {
		for (let j = 0; j<height*d*d*4; j++) {
			pixels[j + i*height] = random(255)
		}
	}
	updatePixels()
}

class PerlinWalker2D {
	constructor(incr, maxX, maxY) {
		this.tx = 0
		this.ty = 1000000000
		this.incr = incr

		this.x = maxX/2;
		this.y = maxY/2;

		this.maxX = maxX
		this.maxY = maxY
	}

	step() {
		this.x = map(noise(this.tx),0,1,0,this.maxX)
		this.y = map(noise(this.ty),0,1,0,this.maxY)

		this.tx += this.incr
		this.ty += this.incr
	}
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