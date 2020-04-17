import React from "react";

function GifSearchInput({handleGifSearchInput, onkeyDown}) {
  return (<div className="gif-search-container" onChange={handleGifSearchInput}>
    <div>
      <label htmlFor="search" className="gif-search-label">GIF Search:</label>
      <input type="text" id="search" className="gif-search-input gif-search-term" onKeyDown={onkeyDown} placeholder="e.g. funny cats"/>
    </div>
  </div>);
}

export default GifSearchInput;
