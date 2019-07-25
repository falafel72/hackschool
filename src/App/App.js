import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import MemeGenerator from './pages/MemeGenerator';
import MemeGallery from './pages/MemeGallery';

const config = require('../config.json');
  
/** Main app controller */
class App extends React.Component {
  downloadImage = (url) => {
    axios({
      url: url,
      method: 'GET',
      responseType: 'blob', // important
    }).then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', 'file.pdf'); //or any other extension
       document.body.appendChild(link);
       link.click();
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
        <NavBar />
        <MemeGeneratorWrapper downloadImage={this.downloadImage}/>
        <Route 
          path="/gallery"
          render = {(routeProps) =>
            <MemeGallery {...routeProps} />   
          } />
        </div>
      </Router>
    );
  }
}

class MemeGeneratorWrapper extends React.Component {
  constructor() {
    super();
    /* get meme data via get request */
    axios.get('https://api.imgflip.com/get_memes')
      .then(response => { 
        if (response.data.success) {
          let memes = response.data.data.memes; 
          this.setState((state) => ({
            memeArray: memes,
            currentMeme: memes[0],
            displayName: memes[0].name,
            isBold: true,
            memeText: new Array(memes[0].box_count)
          }));
        }
      });
    this.state = {
      memeArray: null,
      currentMeme: null,
      displayName: 'Loading...',
      isBold: false,
      memeText: []
    }
  }

   /* called when meme template is changed */
  reselectMeme = (meme) => {
    this.setState((state) => ({
      currentMeme: meme,
      isBold: true,
      memeText: state.memeText.slice(0,meme.box_count)
    }));
  }

  /* called when text needs to be changed when hovering over different templates */
  changeText = (meme) => {
    this.setState((state,props) => ({
      displayName: meme.name,
      isBold: (meme === state.currentMeme)
    }));
  }

  /* called when text needs to be reset to display the name of the current meme */
  resetText = () => {
    this.setState((state,props) => ({
      displayName: state.currentMeme.name,
      isBold: true
    }));
  } 

  handleMemeText = (index,text) => {
    let newMemeTextArray = this.state.memeText;
    newMemeTextArray[index] = text;
    this.setState((state) => ({
      memeText: newMemeTextArray
    }));
  }

  createMeme = () => {
    let data = {
      template_id: this.state.currentMeme.id,
      username: config.username,
      password: config.password,
      text0: this.state.memeText[0],
      text1: this.state.memeText[1],
    }

    // create post request
    return new Promise((resolve, reject) => 
      axios.post('https://api.imgflip.com/caption_image',data,(response) => {
        console.log(response);
        if (response.success) {
          resolve(response.data.url);
        } else {
          reject(response.error_message);
        }
      })
    );
  }

  downloadMeme = () => {
    let urlPromise = this.createMeme();
    urlPromise.then(
      (url) => {
        this.props.downloadImage(url);
      },
      (error) => {
        console.log(error);
      }
    );
    
  }
  
  render() {
    return (
      <Route 
        exact={true}
        path='/' 
        render = {(routeProps) => 
          <MemeGenerator 
            {...routeProps} 
            memeArray={this.state.memeArray} 
            currentMeme={this.state.currentMeme}
            displayName={this.state.memeArray ? this.state.displayName : 'Loading...'}
            reselectMeme={this.reselectMeme}
            changeText={this.changeText}
            resetText={this.resetText}
            isBold={this.state.isBold}
            handleMemeText={this.handleMemeText}
            memeText={this.state.memeText}
            downloadMeme={this.downloadMeme}
          />
        } 
      />
    );
  }
}

/** Component for navigational buttons */
class NavBar extends React.Component {
  render() {
    return(
      <div className='nav-bar'>
        <Link to='/'>Meme Generator</Link>
        <Link to='/gallery'>Gallery</Link>
      </div>
    );
  }
}

export default App;
