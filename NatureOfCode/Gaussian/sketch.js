let distribution = new Array(360);
let cnt = 0;

function setup() 
{
	createCanvas(400, 400);
	background(127);
	frameRate(20);
}
function draw()
{

		background(127);
	angleMode(DEGREES);
	for (let i = 0; i<distribution.length; i++) {
		distribution[i] = floor(randomGaussian(0,60));
	}
	for (let i = 0; i<distribution.length; i++) {
		line(
			height/2,
			width/2,  
			height/2 + distribution[i] * cos(i), 
			width/2 + distribution[i]*sin(i));
	}
}

