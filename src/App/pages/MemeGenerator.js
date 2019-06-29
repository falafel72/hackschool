import React from 'react';
import axios from 'axios';

/** Component that handles the meme generator */
class MemeGenerator extends React.Component {
  constructor() {
    super();
    /* get meme data via get request */
    /* 
      TODO: perhaps load the api in some superclass so we
      only load all the memes once and not every time the page is reloaded
    */
    axios.get('https://api.imgflip.com/get_memes')
      .then(response => { 
        if (response.data.success) {
          console.log(response.data.data.memes);
          let memes = response.data.data.memes; 
          this.setState({
            memeArray: memes
          });
        }
      });
      
    this.state = {
      currentMemeIdx: 0,
      memeArray: null
    }
  }

  render() {
    return( 
      <div className="meme-gen">
        <img src={
          this.state.memeArray ? 
          this.state.memeArray[this.state.currentMemeIdx].url
          : ""
        } alt="Loading..."></img>
        <form className="search" >
          <input type="text"></input>
        </form>
      </div>
    );
  }
}

export default MemeGenerator;
