var numPoints = 100;

// We do a cubic regression y = ax^3 + bx^2 + cx + d
const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));

var trainingCoeffs = {
  a: Math.random(),
  b: Math.random(),
  c: Math.random(),
  d: Math.random()
}

const trainingData = generateData(numPoints, trainingCoeffs, sigma=0.001)

function setup() {
  noCanvas();
  noLoop();
  train(trainingData.xs, trainingData.ys);

  plotPredAndData(trainingData,predict,-1.0,1.0,0.01)
  console.log(trainingCoeffs,[a.get(),b.get(),c.get(),d.get()])

}



function predict(x){
  return tf.tidy(() => {
    return a.mul(x.pow(tf.scalar(3)))
    .add(b.mul(x.square()))
    .add(c.mul(x))
    .add(d);
  });
}

//Defining a loss function MSE
function lossMSE(predictions, labels) {
  //subtract lables from predictions, square and take the mean
  return tf.tidy(() => {
    const meanSquareError = predictions.sub(labels).square().mean();
    return meanSquareError;
  });
}


// The training loop
function train(xs, ys, numIterations = 75) {
  // xs and ys are tensor1ds with training-data (random)
  const learningRate = 0.5;
  const optimizer = tf.train.sgd(learningRate);

  for (let iter = 0; iter <numIterations; iter++) {
    optimizer.minimize(() => {
      const predsYs = predict(xs);
      return lossMSE(predsYs, ys);
    });
  }
}



// Function for plotting randomData and prediction from predict()
function plotPredAndData(randomData,func, xstart, xstop, h) {
  let x = [];
  let y = [];
  n = Math.floor((xstop-xstart)/h);
  for (var i = 0; i<n; i++) {
    x.push(xstart + i*h);
    var y_it = tf.tidy(() => {
      const temp1 = tf.scalar(x[i]);
      const temp2 = predict(temp1);
      return temp2.get();
    });
    y.push(y_it)
  }

  let trace1 = {
    x: x,
    y: y,
    mode: 'lines',
    name: 'Prediction'
  };

  let trace2 = {
    x: randomData.xs.dataSync(),
    y: randomData.ys.dataSync(),
    mode: 'markers',
    name: 'Training Data'
  }

  console.log(trace2)

  let layout = {
    title: 'Predicted cubic polynomial'
  }

  let data = [trace1,trace2]

  Plotly.newPlot('myDiv',data, layout)
}



//--------------------------------------------------------//

function generateData(numPoints, coeff, sigma = 0.04) {
  return tf.tidy(() => {
    const [a, b, c, d] = [
      tf.scalar(coeff.a), tf.scalar(coeff.b), tf.scalar(coeff.c),
      tf.scalar(coeff.d)
    ];

    const xs = tf.randomUniform([numPoints], -1, 1);
    // Generate polynomial data
    const three = tf.scalar(3, 'int32');
    const ys = a.mul(xs.pow(tf.scalar(3)))
      .add(b.mul(xs.square()))
      .add(c.mul(xs))
      .add(d)
      // Add random noise to the generated data
      // to make the problem a bit more interesting
      .add(tf.randomNormal([numPoints], 0, sigma));

    // Normalize the y values to the range 0 to 1.
    const ymin = ys.min();
    const ymax = ys.max();
    const yrange = ymax.sub(ymin);
    const ysNormalized = ys.sub(ymin).div(yrange);
    ysNormalized.print()
    return {
      xs,
      ys: ysNormalized
    };
  })
}
