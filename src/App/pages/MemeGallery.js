import React from 'react'

let memeId = 0; 

/** Component that handles the overall meme gallery page.*/
class MemeGallery extends React.Component {
  
  constructor() {
    super();
      
    this.state = {
      memeArray: null,
    }

    this.handleGetMemes = this.handleGetMemes.bind(this);
  }

  // event handler which retreives memes from the database
  handleGetMemes(event){
    event.preventDefault();
    fetch('/getmemes')
      .then(response => response.json())
      .then(res => {
        this.setState({ memeArray: JSON.stringify(res) });
      });
  }

  render() {
    memeId = 0;
    return( 
      <div>
      <div>
        <MemeModel />
        <MemeModel />
      </div>
      <form onSubmit={this.handleGetMemes} method="GET">
        <button type="Submit"> Get Memes </button>
      </form> 
      <p> {this.state.memeArray} </p>
      </div>
    );
  }
}

// Component that handles each meme displayed.
class MemeModel extends React.Component{
  constructor(){
    super();
    this.state = {
        id: memeId,
        upvotes: 0
    };
    memeId++;
  }

  render(){
    return(
      <h1> This is meme {this.state.id}. </h1>
    )
  }
}

export default MemeGallery;
