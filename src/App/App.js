import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import MemeGenerator from './pages/MemeGenerator';
import MemeGallery from './pages/MemeGallery';

/** Main app controller */
class App extends React.Component {
  constructor(props) {
    super(props);
    /* 
      TODO: 
        - shrink the images down by around half
        - add search functionality (search by meme name)
        - add gallery for meme templates
    */ 
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
      number: -1
    }

    this.reselectMeme = this.reselectMeme.bind(this);
    this.changeText = this.changeText.bind(this);
    this.resetText = this.resetText.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  } 
  
  /* called when meme template is changed */
  reselectMeme(meme) {
    this.setState((state) => ({
      currentMeme: meme
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

  // calls the server and expects a response in the form of a JSON
  handleSubmit(event){
    event.preventDefault();
    fetch('/test')
      .then(response => response.json())
      .then(state => this.setState(state));
  }

  render() {
    return (
      <Router>
        <div className="App">
        <NavBar />
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
        <Route 
          path="/gallery"
          render = {(routeProps) =>
            <MemeGallery {...routeProps} />   
          } />
        </div>
        <form onSubmit={this.handleSubmit}>
        <button type="Submit"> Submit </button>
        </form>
        <p> Hello number {this.state.number} </p>
      </Router>
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
