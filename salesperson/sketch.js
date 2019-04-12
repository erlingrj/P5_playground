var nodes = [];
var indices = [];
var recordDistance;
var bestEver;
var startButton;
var clearButton;
var runTSP;
var niter;
var poop

var buttonWidth = 100;
var buttonHeight =50;


function setup(){
  poop = loadImage('images/poop.png')
  createCanvas(windowWidth,windowHeight);
  frameRate(120)


  recordDistance = Infinity;

  startButton = createButton('Start!')
  startButton.position(0,height-buttonHeight)
  startButton.size(buttonWidth,buttonHeight)
  startButton.mousePressed(startButtonPressed)

  clearButton = createButton("Clear!")
  clearButton.position(buttonWidth,height-buttonHeight)
  clearButton.size(buttonWidth,buttonHeight)
  clearButton.mousePressed(clearButtonPressed)

  runTSP = false;
  niter = 0;
}

function draw(){

  background(0);

  fill(255);

  for(var i = 0; i < nodes.length; i++) {
    image(poop,nodes[i].x-14, nodes[i].y-14)
  }

  if (runTSP) {
    strokeWeight(1);
    stroke(255)
    noFill()
    beginShape()
    for(var i = 0; i < nodes.length; i++) {
      vertex(nodes[i].x, nodes[i].y)
    }
    endShape()

    strokeWeight(4);
    stroke(0,255,0)
    beginShape()
    for(var i = 0; i < nodes.length; i++) {
      vertex(bestEver[i].x, bestEver[i].y)
    }
    endShape()


    if (permute()) {
      niter += 1;

      var d = calcDistance(nodes);
      if (d < recordDistance) {
        recordDistance = d;
        bestEver = nodes.slice()
        console.log("NEW BEST: ", recordDistance)
      }
    }

    else {
      niter += 1;
      runTSP = false;
      console.log("DONE BITCHES", niter)

      noLoop()
    }



  }
  textSize(32)
  stroke(255)
  strokeWeight(1)
  fill(255);
  text((niter*100/factorial(nodes.length)).toFixed(4) + "%",0,32)



}


function swap(a, i, j) {
  var temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}

function calcDistance(points) {
  var sum = 0;
  for (var i = 0; i<points.length-1; i++) {
    var d = dist(points[i].x,points[i].y,points[i+1].x,points[i+1].y)
    sum += d;
  }
  return sum;
}

function startButtonPressed() {
  runTSP = true;
}

function mousePressed() {
  if (mouseX < width) {
    if (mouseY < height-buttonHeight) {
      var v = createVector(mouseX,mouseY)
      var i = nodes.length;

      nodes.push(v);
      indices.push(i);
      bestEver = nodes.slice()
      recordDistance = calcDistance(nodes)
    }
  }
}

function clearButtonPressed() {
  nodes = [];
  indices = [];
  recordDistance = 0;
  bestEver = [];
  runTSP = false;
  niter = 0;
  loop()
}

function permute() {
  var largestI = -1;
  for (var i = 0; i < indices.length - 1; i++) {
    if (indices[i] < indices[i+1]) {
      largestI = i;
    }
  }

  if (largestI == -1) {
    return false
  }



  var largestJ = -1;
  for (var j = 0; j < indices.length; j++) {
    if (indices[j] > indices[largestI]) {
      largestJ = j;
    }
  }

  swap(indices, largestI, largestJ)
  swap(nodes, largestI, largestJ)

  var endIndices = indices.splice(largestI+1);
  endIndices.reverse();
  indices = indices.concat(endIndices);


  var endnodes = nodes.splice(largestI+1)
  endnodes.reverse();
  nodes =  nodes.concat(endnodes);

  return true;
}

function factorial(n) {
  if (n == 1) {
    return 1
  }
  else if(n == 0) {
    return 0;
  }
  else {
    return n*factorial(n-1)
  }
}
