import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import MemeGenerator from './pages/MemeGenerator';

/** Main app controller */
function App() {
  return (
    <Router>
      <div className="App">
      <NavBar />
      <Route exact={true} path='/' component={MemeGenerator} />
      <Route path="/gallery" />
      </div>
    </Router>
  );
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
