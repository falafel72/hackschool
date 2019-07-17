import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import MemeGenerator from './pages/MemeGenerator';
import MemeGallery from './pages/MemeGallery';
  
/** Main app controller */
class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
        <NavBar />
        <MemeGeneratorWrapper />
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
            isBold: true
          }));
        }
      });
    this.state = {
      memeArray: null,
      currentMeme: null,
      displayName: 'Loading...',
      isBold: false,
    }

    this.reselectMeme = this.reselectMeme.bind(this);
    this.changeText = this.changeText.bind(this);
    this.resetText = this.resetText.bind(this);
  }

   /* called when meme template is changed */
   reselectMeme(meme) {
    this.setState((state) => ({
      currentMeme: meme,
      isBold: true
    }));
  }

  /* called when text needs to be changed when hovering over different templates */
  changeText(meme) {
    this.setState((state,props) => ({
      displayName: meme.name,
      isBold: (meme === state.currentMeme)
    }));
  }

  /* called when text needs to be reset to display the name of the current meme */
  resetText() {
    this.setState((state,props) => ({
      displayName: state.currentMeme.name,
      isBold: true
    }));
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
            />
          } />
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
