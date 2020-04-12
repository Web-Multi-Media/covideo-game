import React from "react";

function SearchInput({ handleSearchInput }) {
    return (
        <div className="gif-search-container" onChange={ handleSearchInput } >
            <div>
                <label htmlFor="search" className="gif-search-label">GIF Search:</label>
                <input type="text" id="search" className="gif-search-input gif-search-term" placeholder="e.g. funny cats" />
            </div>
        </div>
    );
}

export default SearchInput;