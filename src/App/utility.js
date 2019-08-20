import axios from 'axios';
import download from 'downloadjs';

/* prepares the meme data to be sent to the api */
export let createMeme = (state) => {
  let data = {
    template_id: state.currentMeme.id,
    text0: state.memeText[0],
    text1: state.memeText[1]
  }

  // create post request
  return new Promise((resolve, reject) => 
    axios.post('localhost:3000/upload',data,(response) => {
      console.log(response);
      if (response.success) {
        resolve(response.data.url);
      } else {
        reject(response.error_message);
      }
    })
  );
}

/* handles click on download button */
export let downloadMeme = (state) => {
  let urlPromise = createMeme(state);
  urlPromise.then(
    (url) => {
      downloadImage(url);
    },
    (error) => {
      console.log(error);
    }
  );
}

/* downloads an image given a url */
export let downloadImage = (url) => {
  axios(
    {
      url: url, 
      method: 'GET', 
      responseType: 'blob'
    }
  ).then((response) => {
    download(response.data, 'test.png', 'image/png');
  });
}