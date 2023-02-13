
let dropSize=30;
let nDrops=300
let sd = 75

function setup() 
{
	createCanvas(400,400);
	frameRate(12)
	background(127)
}

function draw()
{
	background(127)
	for (let i = 0; i<nDrops; i++) {
		let r = floor(random(255));
		let g = floor(random(255));
		let b = floor(random(255));

		let c = color(r,g,b);
		fill(c);
		let dropX =  floor(randomGaussian(0,sd));
		let dropY =  floor(randomGaussian(0,sd));
		circle(width/2 + dropX, height/2 + dropY, dropSize);
	}
}

function mousePressed() {

}
