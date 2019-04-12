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


}



//-----------------------------------------------------//


const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;

const TRAIN_TEST_RATIO = 5 / 6;

const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS);
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH =
  'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

/**
 * A class that fetches the sprited MNIST dataset and returns shuffled batches.
 *
 * NOTE: This will get much easier. For now, we do data fetching and
 * manipulation manually.
 */
class MnistData {
  constructor() {
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
  }

  async load() {
    // Make a request for the MNIST sprited image.
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgRequest = new Promise((resolve, reject) => {
      img.crossOrigin = '';
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer =
          new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

        const chunkSize = 5000;
        canvas.width = img.width;
        canvas.height = chunkSize;

        for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
            IMAGE_SIZE * chunkSize);
          ctx.drawImage(
            img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
            chunkSize);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // All channels hold an equal value since the image is grayscale, so
            // just read the red channel.
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer);

        resolve();
      };
      img.src = MNIST_IMAGES_SPRITE_PATH;
    });

    const labelsRequest = fetch(MNIST_LABELS_PATH);
    const [imgResponse, labelsResponse] =
    await Promise.all([imgRequest, labelsRequest]);

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

    // Create shuffled indices into the train/test set for when we select a
    // random dataset element for training / validation.
    this.trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS);
    this.testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS);

    // Slice the the images and labels into train and test sets.
    this.trainImages =
      this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.trainLabels =
      this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    this.testLabels =
      this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
  }

  nextTrainBatch(batchSize) {
    return this.nextBatch(
      batchSize, [this.trainImages, this.trainLabels], () => {
        this.shuffledTrainIndex =
          (this.shuffledTrainIndex + 1) % this.trainIndices.length;
        return this.trainIndices[this.shuffledTrainIndex];
      });
  }

  nextTestBatch(batchSize) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
        (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  nextBatch(batchSize, data, index) {
    const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
    const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

    for (let i = 0; i < batchSize; i++) {
      const idx = index();

      const image =
        data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
      batchImagesArray.set(image, i * IMAGE_SIZE);

      const label =
        data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
      batchLabelsArray.set(label, i * NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

    return {
      xs,
      labels
    };
  }
}



const model = tf.sequential();
var data;
var loss_history = []
var accuracy_history = []

async function load() {
  console.log("Loading data from Mnist dataset...")
  data = new MnistData();
  await data.load();
  console.log("Check, data has been loaded")
}



async function setup1() {
  await load();
  await train();
  plotLossAndAcc(loss_history, accuracy_history)

}

function setup() {
  setup1()
}

// First convolutional layer.
// Input is 28x28x1 pixelarryas
// The "sliding window" is 5x5 (kernelSize)
// The numer of filterwindows of size kernelSize is 8
// strides i.e. steplength for sliding window is 1.
// Relu activation. Weights initialized with VarianceScaling
model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling'
}));


// Max Pooling Layer.
// poolSize: The size of the sliding pooling window applied to the input data
// will apply 2x2 windows on the input data
// stdrides: 2x2 Steplength for the windows.
model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  strides: [2, 2]
}));

//Repeating layer structure.
//Note that we double the filters.
model.add(tf.layers.conv2d({
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'VarianceScaling',
}));

model.add(tf.layers.maxPooling2d({
  poolSize: [2, 2],
  strides: [2, 2]
}));

//Then a flatten layer
model.add(tf.layers.flatten());

// Lastly a fully connected (dense) layer which will
// Perform the final classification.
// Units: Number of output neurons/size of output activation
//Activation softmax. Thos normalizes our 10D output vector into a prob.dist.

model.add(tf.layers.dense({
  units: 10,
  kernelInitializer: 'VarianceScaling',
  activation: 'softmax',
}));

//Defining the Optimizer
const LEARNING_RATE = 0.15;
const optimizer = tf.train.sgd(LEARNING_RATE)

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

console.log(model)


// Before training the model. We need to define some parameters
// How many training examples before updating parameters/weights?
const BATCH_SIZE = 64;
// How many such batches of examples
const TRAIN_BATCHES = 100;

// Every TEST_ITERATION_FREQUENCY batches we test accuracy over TEST_BATCH_SIZE
// examples.
const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 5;


// THE TRAINING LOOP

async function train() {
  console.log('Starting training of CNN...')
  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = data.nextTrainBatch(BATCH_SIZE);

    let testBatch;
    let validationData;

    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, 28, 28, 1]), testBatch.labels
      ];
    }

    const history = await model.fit(
      batch.xs.reshape([BATCH_SIZE, 28, 28, 1]),
      batch.labels, {
        batchSize: BATCH_SIZE,
        validationData,
        epochs: 1,
      });

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

    loss_history.push(loss)
    accuracy_history.push(accuracy)



  }
  console.log("Training Done")
}

function plotLossAndAcc(loss, acc) {
  let x = [];
  for (let i = 0; i < loss.length; i++) {
    x.push(i);
  }
  trace1 = {
    x: x,
    y: loss,
    mode: 'markers',
    name: 'Loss History',
  };

  trace2 = {
    x: x,
    y: acc,
    mode: 'markers',
    name: 'Accuracy History',
  };

  let plot_data = [trace1, trace2];
  let layout = {
    title: 'History of accuracy and loss on test set',
  };

  Plotly.newPlot("myDiv", plot_data, layout)
}

path = 'localstorage://my-model';

async function saveTfModel(model, path) {
  const saveResult = await model.save(path);
}

function loadTfModel(newModel, path) {
  tf.loadModel(path)
    .then(model => {
      newModel = model;
    })
}