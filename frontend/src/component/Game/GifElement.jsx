import React from "react";

function GifElement(props) {
  return (<div className="gif-container">
    <a href={props.gif.images.fixed_width_downsampled.url}>
      <img src={props.gif.images.fixed_width_downsampled.url} onClick={() => props.sendGif(props.gif.images.original.url)} className="gif"/>
    </a>
  </div>);
}

export default GifElement;
