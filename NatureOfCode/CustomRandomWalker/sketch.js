let distribution = new Array(360);
let cnt = 0;
var walker;


function setup() 
{
	createCanvas(400, 400);
	background(127);
	strokeWeight(5)
	walker = new WalkerCustom(400);

}
function draw()
{
	walker.step()
	walker.render()

}


class WalkerCustom {
	constructor() {
		this.x = width / 2;
		this.y = height / 2;
		this.max = 20
	}

	// Implement a custom distribution where the probability of
	// CDF is like x*x
	get_random() {
		while (true) {
			var P1 = random(this.max)
			
			var prob = P1*P1

			var P2 = random(this.max)

			if (P2 < prob) {
				return P1;
			}
		}
	}

	render() {
		stroke(1);
		point(this.x, this.y);
	}

	step() {
		var choice = floor(random(4));
		var length = this.get_random()
		console.log(length)

		if (choice == 0) {
			this.x += length;
		} else if (choice == 1) {
			this.x -= length;
		} else if (choice == 2) {
			this.y += length;
		} else if (choice == 3) {
			this.y -= length;
		}

    this.x = constrain(this.x, 0, width - 1);
    this.y = constrain(this.y, 0, height - 1);
	}
}