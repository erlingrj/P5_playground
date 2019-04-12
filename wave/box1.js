var Balls = new BallSystem()
var velocity, radius;

function setup() {
  createCanvas(710,400);
  velocity = 2.0;
  frameRate = 10;
  radius = 20;
}

function draw() {
  background(255);
  Balls.run();
}


// Spawn balls
function mousePressed() {
  Balls.addBall(mouseX,mouseY)
}


// A simple ball-class
function Ball(position) {
  this.velocity = createVector(random(-1,1)*velocity,random(-1,1)*velocity);
  this.position = position.copy();
}

Ball.prototype.display = function() {
  fill(0)
  stroke(0)
  ellipse(this.position.x,this.position.y,radius*2,radius*2)
}

Ball.prototype.update = function() {
  this.position.add(this.velocity);
  var coll = this.detectWallCollision()

  if (coll == 1 || coll == 2) {
    this.velocity = createVector(this.velocity.x*-1,this.velocity.y);
  }

  if (coll == 3 || coll == 4) {
    this.velocity = createVector(this.velocity.x, this.velocity.y*-1);
  }
}

Ball.prototype.isAlive = function() {
  if (this.position.x < 0 || this.position.x > width || this.position.y < 0 || this.position.y > height) {
    return false;
  }
  else {
    return true;
  }
}

Ball.prototype.run = function() {
  this.update()
  this.display()
}

Ball.prototype.detectWallCollision = function() {
  if (this.position.x < radius) {
    return 1;
  }
  else if (this.position.x > width-radius) {
    return 2;
  }
  else if (this.position.y < radius) {
    return 3;
  }
  else if (this.position.y > height-radius) {
    return 4;
  }
  else {
    return 0;
  }
}


// Ball-system class
function BallSystem() {
  this.balls = []
  this.length = 0;
}

BallSystem.prototype.addBall = function(x,y) {
  b = new Ball(createVector(x,y));
  this.balls.push(b);
  this.length += 1;
}

BallSystem.prototype.run = function() {
  for (var i = this.balls.length - 1; i >= 0; i--) {
    var b1 = this.balls[i];
    b1.run();
    if(b1.isAlive == false) {
      this.balls.splice(i,1);
      this.length -= 1;
    }
    for (var j = i-1; j>=0; j--) {
      var b2 = this.balls[j];
      if (b1.position.dist(b2.position) <= 2 * radius) {
        this.collision(i,j);
        this.balls[i].run();
        this.balls[j].run();
      }
    }
  }
}

BallSystem.prototype.collision = function(i,j) {

  var b1 = this.balls[i];
  var b2 = this.balls[j];
  // Get a new coordinate basis from the collision point.
  var q1 = p5.Vector.sub(b1.position,b2.position).normalize();
  var q2 = q1.copy().rotate(HALF_PI).normalize();

  //Standard basis
  var n1 = createVector(1,0);
  var n2 = createVector(0,1);

  // Decompose the velocites along the new basis
  var b1_vel = createVector(0.0,0.0);
  var b2_vel = createVector(0.0,0.0);

  b1_vel.x = p5.Vector.dot(b2.velocity,q1);
  b1_vel.y = p5.Vector.dot(b1.velocity,q2);

  b2_vel.x = p5.Vector.dot(b1.velocity,q1);
  b2_vel.y = p5.Vector.dot(b2.velocity,q2);

  //The velocity tangent to the collision (along q2) is unchanged
  //Since we have the same mass of the balls, the velocity
  //along the q1 is swapped between the two.
  console.log(b1)

  // Transform back to standard basis.
  this.balls[i].velocity.x = b1_vel.x*p5.Vector.dot(q1,n1) + b1_vel.y*p5.Vector.dot(q2,n1);
  this.balls[i].velocity.y = b1_vel.x*p5.Vector.dot(q1,n2) + b1_vel.y*p5.Vector.dot(q2,n2);

  this.balls[j].velocity.x = b2_vel.x*p5.Vector.dot(q1,n1) + b2_vel.y*p5.Vector.dot(q2,n1);
  this.balls[j].velocity.y = b2_vel.x*p5.Vector.dot(q1,n2) + b2_vel.y*p5.Vector.dot(q2,n2);

  console.log(b2)
}
