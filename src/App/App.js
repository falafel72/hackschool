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
          this.setState({
            memeArray: memes
          });
        }
      });
    this.state = {
      memeArray: null
    }
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
            <MemeGenerator {...routeProps} memeArray={this.state.memeArray} />
          } />
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
