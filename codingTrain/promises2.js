function setup() {
  noCanvas();
  delay('blahblah')
    .then(() => createP('hello'))
    .catch((err) => console.error(err));

}

function delay(time) {
  return new Promise((resolve, reject) => {
    if (isNaN(time)) {
      reject(new Error('delay requires a valid numer'));
    } else {
      setTimeout(resolve, time);
    }
  });

}

function delayES8(time) {

  await delay(time);

  return;

}


function sayHello() {
  createP('Hello');
}