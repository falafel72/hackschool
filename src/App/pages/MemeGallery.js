import React from 'react'

/** Component that handles the overall meme gallery page.*/
class MemeGallery extends React.Component {
  
  // TODO: Think about what states I need for Meme Gallery
  // constructor() {
  //   super();
      
  //   this.state = {
      
  //   }
  // }

  render() {
    return( 
      <div>
        <MemeModel />
        <MemeModel />
      </div>
    );
  }
}

let memeId = 0; 

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
