import React from 'react';

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
    ></img>
  );
}

/** Component that handles the meme generator */
class MemeGenerator extends React.Component {
  constructor() {
    super();
      
    this.state = {
      currentMemeIdx: 0,
      imgWidth: 0, 
      imgHeight: 0,
      memeName: 'test'
    }

    this.reselectImage = this.reselectImage.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  reselectImage(meme) {
    this.setState({
      currentMemeIdx: this.props.memeArray.indexOf(meme)
    });
  }

  handleInput(event) {
    this.setState({memeName: event.target.value})
  }

  render() {
    let imgObj = this.props.memeArray ? this.props.memeArray[this.state.currentMemeIdx] : null;
    let memeDivList = this.props.memeArray ? this.props.memeArray.map((meme) => 
      <TemplateButton 
        key={meme.id} 
        meme={meme} 
        reselectImage={() => this.reselectImage(meme)} />
    ) : null;
    return( 
      <div className='meme-gen'>
        {/* align left  */}
        <div className='img-preview'>
          <Canvas imgObj={imgObj} />
        {/* align right */}
        </div>
        <div className='template-search' >
          <input id='search' type='text' onChange={this.handleInput}></input>
          <div id='catalogue'>
            <h2>{imgObj ? imgObj.name : 'Loading...'}</h2>
            <div id='meme-templates'>
              {memeDivList}
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
      width = this.props.imgObj.width/2;
      height = this.props.imgObj.height/2;
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
