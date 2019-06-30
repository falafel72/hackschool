import React from 'react';

/** Component that handles the meme generator */
class MemeGenerator extends React.Component {
  constructor() {
    super();
      
    this.state = {
      currentMemeIdx: 1,
      memeArray: null
    }
  }

  render() {
    return( 
      // align left 
      <div className='meme-gen'>
        <div className="img-preview">
          <img src={
            this.props.memeArray ? 
            this.props.memeArray[this.state.currentMemeIdx].url
            : ''
          } alt='Loading...'></img>
        </div>
        {/* align right */}
        <div className='template-search' >
          <input id='search' type='text'></input>
          <div id='catalogue'>
            <h2>MEME TITLE</h2>
            {/* list of images go here */}
          </div>
        </div>
      </div>
    );
  }
}

export default MemeGenerator;
