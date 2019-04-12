var margin_bottom = 50;
var TFCanvas, myCanvas, doneButton, clearButton, wrongButton, model, data, imgOriginal, imgResized, imgTensor, img;
var imgArr = []
var loss_history = []
var accuracy_history = []

function setup() {
  myCanvas = createCanvas(400, 400);
  myCanvas.parent('canvas');

  TFCanvas = document.getElementById('TFplot')
  TFCanvas.width = width
  TFCanvas.height = height
  TFCanvas.style.width = '400px';
  TFCanvas.style.height = '400px'

  console.log(TFCanvas)

  doneButton = createButton('Done!')
  doneButton.mousePressed(doneButtonPressed)
  doneButton.position(0, height + 4 * doneButton.height)
  clearButton = createButton('Clear!')
  clearButton.mousePressed(clearButtonPressed)
  clearButton.position(width - doneButton.width, height + 4 * doneButton.height)

  background(255)

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


  // Load and Train model:

  data = new MnistData();
  console.log("Fetching MNIST dataset")

  data.load().then(() => {
    console.log('MNIST fetched')
    train(data)
  });


  console.log("All clear!")
}

function draw() {
  strokeWeight(50);
  fill(0)
  if (mouseIsPressed) {
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function doneButtonPressed() {
  imgArr = []
  // Load the drawing into a p5-object
  imgOriginal = get()
  // resize to fit the shape of the TF model
  imgOriginal.resize(28, 28)
  imgOriginal.loadPixels()

  // Load the pixels onto an array, map from 0-255 to 0-1
  // Also, move from RGBA -> Greyscale.
  for (let i = 0; i < imgOriginal.pixels.length; i += 4) {
    if (imgOriginal.pixels[i] == 255) {
      imgArr.push(1);
    } else {
      imgArr.push(0)
    }
  }

  // Create tensor of the pixels.
  tf.toPixels(tf.tensor(imgArr, [28, 28]), TFplot)
  const prediction = model.predict(tf.tensor(imgArr, [1, 28, 28, 1]))
  prediction.print()
  printPredictions(prediction.dataSync())
}

function clearButtonPressed() {
  background(255)
}


function printPredictions(predArr) {

  predArr.forEach((element, index) => predArr[index] *= 100);

  var predData = [{
    x: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    y: predArr,
    type: 'bar',
  }];

  var layout = {
    title: 'I guess: ',
    xrange: [0, 1, 9],
    yrange: [0, 100],
  }

  Plotly.newPlot('plot', predData, layout)


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

const BATCH_SIZE = 40;
const TRAIN_BATCHES = 1000;
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