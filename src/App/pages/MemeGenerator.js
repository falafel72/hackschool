import React from 'react';
import axios from 'axios';

/** Component for selecting meme template */
function TemplateButton(props) {
  return (
    <img 
        key={props.meme.id}
        width='50' 
        height='50' 
        src={props.meme.url} 
        alt='' 
        onClick={props.reselectImage}
        onMouseOver={props.changeText}
        onMouseLeave={props.resetText}
        className='meme-template' >
    </img>
  );
}

function MemeTextBox(props) {
  return (
    <div className='memetext'>
      <p>Text Box {props.index}</p>
      <textarea 
        cols='50' 
        rows='5' 
        // onChange={props.handleMemeText(props.key)}>
        >
      </textarea>
    </div>
  )
}

/** Component that handles the meme generator */
class MemeGenerator extends React.Component {
  constructor() {
    super();
      
    this.state = {
      searchTerm: "",
      memeText: []
    };
  }

  handleInput = (event) => {
    event.persist();
    this.setState(() => ({
      searchTerm: event.target.value
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let myImg = {
      photoURL: this.props.currentMeme.url,
      topText: "top",
      bottomText: "bottom",
      user: "Daniel Truong"
    };
    axios.post('/upload', myImg)
      .then(response => {
        console.log("Image has been uploaded: " + myImg.photoURL);
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleMemeText = (index) => {
    return (text) => {
      let newMemeTextArray = this.state.memeText;
      newMemeTextArray[index] = text;
      this.setState((state) => ({
        memeText: newMemeTextArray
      }));
    };
  }
  
  checkMatch = (meme) => {
    let regexp = new RegExp(this.state.searchTerm,'gi');
    return (this.state.searchTerm === "" || meme.name.match(regexp) != null);
  }
  
  createTextBoxes = () => {
    let boxList = [];
    if (this.props.currentMeme) {
      for (let i = 0; i < this.props.currentMeme.box_count; i++) {
        boxList.push(
          <MemeTextBox key={i} index= {i} handleMemeText={this.handleMemeText(i)}/>
        );
      }
    }
    return boxList;
  }

  render() {
    let imgObj = this.props.memeArray ? this.props.currentMeme : null;
    return ( 
      <div className='meme-gen'>
        {/* align left  */}
        <div className='img-preview'>
          <Canvas imgObj={imgObj} />
          <div>
            <form onSubmit={this.handleSubmit} method="POST">
              <button type="Submit"> Submit Meme </button>
            </form> 
          </div>
        {/* align right */}
        </div>
        <div className='textboxes'>
          {this.createTextBoxes()}
        </div>
        <div className='template-search' >
          <input id='search' type='text' onChange={this.handleInput}></input>
          <div id='catalogue'>
            <p style={{
              fontWeight: this.props.isBold ? 'bold' : 'normal'
            }}>{this.props.displayName}</p>
            <div id='meme-templates'>
              {
                this.props.memeArray && 
                this.props.memeArray.filter(this.checkMatch).map((meme) => (
                  <TemplateButton 
                  key={meme.id} 
                  meme={meme} 
                  reselectImage={() => this.props.reselectMeme(meme)} 
                  changeText={() => this.props.changeText(meme)} 
                  resetText={this.props.resetText}/>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/** 
 * Component for rendering all canvas elements
 * May be used to also draw text
 */
class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
  }

  drawImage() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (this.props.imgObj) {
      let img = new Image();
      img.onload = () => {ctx.drawImage(img,0,0,img.width,img.height,
                                            0,0,canvas.width,canvas.height)};
      img.src = this.props.imgObj.url;
    }
  }

  componentDidMount() {
    this.drawImage();
  }

  componentDidUpdate() {
    this.drawImage();
  }

  render() {
    let width;
    let height;
    if (this.props.imgObj) {
      width = 500;
      height = this.props.imgObj.height/(this.props.imgObj.width/500);
    } else {
      width = 0;
      height = 0;
    }
    return (
      <div>
        <canvas 
          width={width} 
          height={height}
          ref={this.canvasRef}
        />
      </div>
    );
  }
}

export default MemeGenerator;
