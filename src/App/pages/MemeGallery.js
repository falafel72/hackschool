import React from 'react';
require('../style/meme.css');

/** Component that handles the overall meme gallery page.*/
class MemeGallery extends React.Component {

  constructor() {
    super();

    fetch('/getmemes')
      .then(response => response.json())
      .then(data => {
        this.setState({
          memeArray: data,
        })
      });
 
    this.state = {
      memeArray: null,
    }

  }

  render() {
    let ourFavorites = this.state.memeArray ? this.state.memeArray.map ((meme) => 
      <MemeModel 
        key={meme.id}
        photoURL={meme.photoURL}
        topText={meme.topText}
        bottomText={meme.bottomText}
        user={meme.user}
        likes={meme.likes}
      />
    ) : null;
    return( 
      <div>
        {ourFavorites}
      </div>
    );
  }
}

// Component that handles each meme displayed.
class MemeModel extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: this.props.id,
      photoURL: this.props.photoURL,
      topText: this.props.topText,
      bottomText: this.props.bottomText,
      user: this.props.user,
    };
  }

  render(){
    return(
      <div className="memeModel">
        <div className="memeImageText">
          <img className="memeImage" src={this.state.photoURL} alt={this.state.photoURL}/>
          <h2> {this.props.topText} </h2>
          <h2> {this.props.bottomText} </h2>
        </div>
        <div className="controls">
          <h4> by {this.props.user} </h4>
          <LikesController likes={this.props.likes} />
        </div>
      </div>
    )
  }
}

class LikesController extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      likes: this.props.likes,
      isBolded: false,
    }

    this.handleLike = this.handleLike.bind(this);
  }

  handleLike(event){
    event.preventDefault();
  }

  render(){
    let buttonType = this.state.isBolded ? "unselected" : "selected";
    return(
      <form onSubmit={this.handleLike}>
        <button className={buttonType} type="Submit">👍 {this.state.likes}</button>
      </form> 
    )
  }

}

export default MemeGallery;
