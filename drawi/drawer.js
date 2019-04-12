var margin_bottom = 50;
var doneButton, clearButton, img, model, canvas, data;
var imgArr = []
var loss_history = []
var accuracy_history = []

function setup() {
  //canvas = document.getElementByID('myCanvas')
  pixelDensity(1)
  canvas = createCanvas(420, 420)
  img_arr = []
  background(255);
  strokeWeight(20);
  stroke(0)
  doneButton = createButton('Done!');
  doneButton.position(width / 4, height);
  doneButton.mousePressed(doneButtonPressed);

  clearButton = createButton('Clear!');
  clearButton.position(2 * width / 4, height);
  clearButton.mousePressed(clearButtonPressed)

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDpBtRmmYYzxsOYGAuT34t5vDlUhEdkNQY",
    authDomain: "drawi-f76b8.firebaseapp.com",
    databaseURL: "https://drawi-f76b8.firebaseio.com",
    projectId: "drawi-f76b8",
    storageBucket: "",
    messagingSenderId: "556017257087"
  };
  firebase.initializeApp(config);


  // Create TF model:
  model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'VarianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2]
  }));

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

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 10,
    kernelInitializer: 'VarianceScaling',
    activation: 'softmax',
  }));

  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE)

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });


  console.log(model)
  // Load and Train model:

  data = new MnistData();
  console.log("Fetching MNIST dataset")
  data.load().then(() => {
    console.log('MNIST fetched')
    train(data)
  });

  console.log(model)


}

function draw() {
  strokeWeight(1)
  line(0, 0, width, 0);
  line(0, 0, 0, height - margin_bottom);
  line(0, height - margin_bottom, width, height - margin_bottom);
  line(width - 1, 0, width - 1, height - margin_bottom)

  strokeWeight(25);
  if (mouseIsPressed && mouseIsLegal()) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }

}

function mouseIsLegal() {
  if (mouseY < height - margin_bottom) {
    return true;
  } else {
    return false;
  }
}

function saveAndReshape() {
  loadPixels();
  var img = createImage(width, height);
  img.loadPixels();
  for (let i = 0; i < pixels.length; i++) {
    img.pixels[i] = pixels[i]
  }
  img.updatePixels();
  img.resize(28, 28);

  var returnArr = []

  for (let i = 0; i < img.pixels.length; i += 4) {
    returnArr.push(map(img.pixels[i], 0, 255, 0, 1))
  }
  return returnArr
}

function doneButtonPressed() {
  img = saveAndReshape()
  const imageTensor = tf.tensor(img, [1, 28, 28, 1])

  model.predict(imageTensor).print()
  background(255);
}

function clearButtonPressed() {
  background(255)
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





const BATCH_SIZE = 64;
const TRAIN_BATCHES = 100;
const TEST_BATCH_SIZE = 1000;
const TEST_ITERATION_FREQUENCY = 5;

async function train(myData) {
  console.log('Starting training of CNN...')
  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = myData.nextTrainBatch(BATCH_SIZE);

    let testBatch;
    let validationData;

    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = myData.nextTestBatch(TEST_BATCH_SIZE);
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