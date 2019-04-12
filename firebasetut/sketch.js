var database, clickButton, initialInput, submitButton, points, textsize;



function setup() {
  createCanvas(200, 200).parent('game')
  createP('Click the button to get $$').parent('game')
  clickButton = createButton('Click me').parent('game')
  clickButton.mousePressed(clickButtonPressed);
  initialInput = createInput('initials').parent('game')
  submitButton = createButton('Submit').parent('game')
  submitButton.mousePressed(submitButtonPressed)

  textsize = 48;
  points = 0;


  var config = {
    apiKey: "AIzaSyBk_UuDRZN6RwQNb32S19-oVcHDk-fvVPk",
    authDomain: "my-project-19af5.firebaseapp.com",
    databaseURL: "https://my-project-19af5.firebaseio.com",
    projectId: "my-project-19af5",
    storageBucket: "my-project-19af5.appspot.com",
    messagingSenderId: "250183701216"
  };
  firebase.initializeApp(config);
  console.log(firebase);

  database = firebase.database();
  var ref = database.ref('scores');
  ref.on('value', gotData, errData);

}

function gotData(data) {
  var scoreListings = selectAll('.scoreListing');

  for (var i = 0; i < scoreListings.length; i++) {
    scoreListings[i].remove();
  }


  console.log(data.val());
  var scores = data.val();
  var keys = Object.keys(scores);

  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var name = scores[k].name;
    var score = scores[k].score;
    //console.log(name, score);
    var li = createElement('li', name + ': ' + score)
    li.class('scoreListing')
    li.parent('scoreList');
  }
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

function draw() {
  background(0);
  fill(255);
  textSize(textsize);
  textAlign(CENTER)
  text(points, width / 2, height / 2)
}


function clickButtonPressed() {
  points += 1;
}

function submitButtonPressed() {
  var data = {
    name: initialInput.value(),
    score: points
  }
  var ref = database.ref('scores');
  var result = ref.push(data);
  console.log(result)
  points = 0;
}