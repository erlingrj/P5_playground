const a = tf.scalar(2);
const b = tf.scalar(4);
const c = tf.scalar(8);


function setup() {
  memoryManagementWithTidy()
}

function predict(input) {
  // y = a * x ^ 2 + b * x + c
  return tf.tidy(() => {
    const x = tf.scalar(input);

    const ax2 = a.mul(x.square());
    const bx = b.mul(x);
    const y = ax2.add(bx).add(c);

    return y;
  });
}


// Example of a simple one layer perceptron
// Data and labels needs to fit the input shape.
function simpleLayerModel(data, labels) {
  const model = tf.sequential();
  model.add(
    tf.layers.simpleRNN({
      units: 20,
      recurrentInitializer: 'GlorotNormal',
      inputShape: [80,4]
    })
  );

  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE)

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  });
  model.fit({x: data, y: labels});
}

function memoryManagementWithDispose() {
  // dispose to purge a variable and free up its GPU memoryManagement

  const x = tf.tensor2d([[0.0,2.0],[4.0,6.0]]);
  const x_squared = x.square();

  x.print();
  x_squared.print();

  // Free memory
  x.dispose();
  x_squared.dispose();

  // Should yield error
  x.print()
}

function memoryManagementWithTidy() {


  const average = tf.tidy(() => {
    // tf.tidy will clean up the GPU memory used
    // by tensors inside this function, other than the tensor that is returned
    const y = tf.tensor1d([1.0,2.0,3.0,4.0]);
    const z = tf.ones([4]);
    return y.sub(z).square().mean();
  })

  average.print()
}
