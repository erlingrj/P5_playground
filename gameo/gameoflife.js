var cell = []
var next = []
var sizeX, sizeY

function setup() {
  createCanvas(720,360);
  background(255)
  frameRate(5)
  stroke(0)

  sizeX = width/10
  sizeY = height/10

  for (var x = 0; x < sizeX; x++) {
    cell[x] = [];
    next[x] = [];
    for (var y = 0; y< sizeY; y++){
      if (random() > 0.7) {
        next[x][y] = 1;
        cell[x][y] = 1;
      }
      else {
        next[x][y] = 0;
        cell[x][y] = 0;
      }
    }
  }
}



function draw(){

  ///First check ordinary cells
  for (var i = 1; i < sizeX-1; i++) {
    for (var j = 1; j < sizeY -1; j++) {

      var adj = adjacent(cell,i,j);
      if (adj == 3) {
        next[i][j] = 1;
      }
      else {
        next[i][j] = 0;
      }

      }


    }


  ///Then the top row
  for (var i = 1; i < sizeX-1; i++) {
    var adj = cell[i-1][1] + cell[i][1] + cell[i+1][1];
    if (adj == 3) {
      next[i][0] = 1;
    }
    else {
      next[i][0] = 0;
    }

  }

  ///Then bottom row

  for (var i = 1; i < sizeX-1; i++) {
    var adj = cell[i-1][sizeY-2] + cell[i][sizeY-2] + cell[i+1][sizeY-2];
    if (adj == 3) {
      next[i][sizeY-1] = 1;
    }
    else {
      next[i][sizeY-1] = 0;
    }

  }

  ///Left column
  for (var j = 1; j < sizeY-1; j++) {
    var adj = cell[1][j-1] + cell[1][j] + cell[1][j+1];

    if (adj == 3) {
      next[0][j] = 1;
    }
    else {
      next[0][j] = 0;
    }
  }



  //Right column
  for (var j = 1; j < sizeY-1; j++) {
    var adj = cell[sizeX-2][j-1] + cell[sizeX-2][j] + cell[sizeX-2][j+1];

    if (adj == 3) {
      next[sizeX-1][j] = 1;
    }
    else {
      next[sizeX-1][j] = 0;
    }
  }

  //Corners
  //Upper right

  var adj = cell[1][0] + cell[1][1] + cell[0][1];
  if (adj == 3) {
    next[0][0] = 1;
  }
  else {
    next[0][0] = 0;
  }


  //Upper left
  adj = cell[sizeX-2][0] + cell[sizeX-2][1] + cell[sizeX-1][1];
  if (adj == 3) {
    next[sizeX-1][0] = 1;
  }
  else {
    next[sizeX-1][0] = 0;
  }

  //Lower left
  adj = cell[0][sizeY-2] + cell[1][sizeY-2] + cell[1][sizeY-1];
  if (adj == 3) {
    next[0][sizeY-1] = 1;
  }
  else {
    next[0][sizeY-1] = 0;
  }

  //Lower right
  adj = cell[sizeX-1][sizeY-2] + cell[sizeX-2][sizeY-2] + cell[sizeX-2][sizeY-1];
  if (adj == 3) {
    next[sizeX-1][sizeY-1] = 1;
  }
  else {
    next[sizeX-1][sizeY-1] = 0;
  }

    for (var i = 0; i < sizeX; i++) {
      for (var j = 0; j < sizeY; j++) {
        if (next[i][j] == 1) {
          fill(0);
        }
        else {
          fill(255);
        }
        rect(10*i,10*j,10,10)
        cell[i][j] = next[i][j];
      }
    }

}

function adjacent(arr,i,j) {
  return arr[i-1][j-1] + arr[i-1][j] + arr[i-1][j+1] + arr[i][j-1] + arr[i][j+1] + arr[i+1][j] + arr[i+1][j-1] + arr[i+1][j+1];
}
