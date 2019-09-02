import axios from 'axios';
import download from 'downloadjs';

/* prepares the meme data to be sent to the api */
export let createMeme = (state) => {
  let data = {
    template_id: state.currentMeme.id,
    memeTexts: state.memeText
  }

  // create post request
  return new Promise((resolve, reject) => 
    axios({
      method: 'post',
      url: '/upload',
      data: data 
    })
      .then((response) => {
        if (response.data.success) {
          resolve(response.data.url);
        } else {
          reject(response.data.error_message);
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
  let imgName = url.match(/\w*\.\w*$/)[0];
  axios(
    {
      url: url, 
      method: 'GET', 
      responseType: 'blob'
    }
  ).then((response) => {
    download(response.data, imgName, 'image/png');
  });
}