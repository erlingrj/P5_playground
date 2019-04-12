let giphyAPIkey = 'L8AUbR9L2feXhFPOtwZoP0KcwSAv0UoG';
let giphyURL = 'http://api.giphy.com/v1/gifs/random?api_key=L8AUbR9L2feXhFPOtwZoP0KcwSAv0UoG';

let test;

function setup() {
  noCanvas();
  fetch(giphyURL)
    .then(response =>  {
      return response.json();
    })
    .then(json => {
      createP(json.data.title)
      createImg(json.data.images['original'].url)
    })
    .catch(err => console.log(err));

}
