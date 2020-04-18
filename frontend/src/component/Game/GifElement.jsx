import React from "react";

function GifElement(props) {
  return (<div className="gif-container">
    <img src={props.gif.images.fixed_width_downsampled.url} onClick={() => props.sendGif(props.gif.images.original.url)} className="gif"/>
  </div>);
}

export default GifElement;
