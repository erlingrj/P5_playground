

function setup() {
  noCanvas();
  noLoop()

  const model = tf.sequential();
  model.add(tf.layers.conv2d({
    inputShape: [28,28,1],
    kernelSize: 5,
    filters: 8,
    striders: 1,
    activation: 'relu',
    kernalInitializer: 'VarianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2,2],
    strides: [2,2]
  }));

  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu'
    kernelInitializer: 'VarianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2,2],
    strides:[2,2]
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 10,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax'
  }))

  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE;

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  //const vtense = tf.variable(tense);
  //console.log(vtense)

  //console.log(tense.get(0,0,0))


}

function draw() {


}
