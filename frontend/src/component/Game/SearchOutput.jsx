import React from "react";
import GifElement from "./GifElement";

function SearchOutput({gifs, sendGif}) {
  return (<div className="gifs-output">
    {
      gifs.length > 0
        ? gifs.map(gif => <GifElement key={gif.id} gif={gif} sendGif={sendGif}/>)
        : <p>No GIFs Found</p>
    }
  </div>);
}

export default SearchOutput;
