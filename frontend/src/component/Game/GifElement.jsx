import React from "react";

function GifElement(props) {
  const sendGif = () => {
    props.sendGif(props.gif.images.original.url);
  }
  return (<React.Fragment>
    <img
      alt='gif'
      src={props.gif.images.fixed_width_downsampled.url}
      onClick={sendGif}/>
  </React.Fragment>);
}

export default GifElement;
