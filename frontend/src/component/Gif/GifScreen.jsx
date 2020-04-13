import React, {useState} from "react";
import "./GifScreen.css";
import Loader from "./Loader";
import SearchOutput from "./SearchOutput";
import Button from "@material-ui/core/Button";

function GifScreen({sendGif, startTimer} ) {

    const [searchTerm, setsearchTerm] = useState( '');
    const searchLimit = 12;
    const [searching, setsearching] = useState( false);
    const [searched, setsearched] = useState( false);
    const [gifs, setgifs] = useState( []);
    const url= 'https://api.giphy.com/v1/gifs/search?';
    const apiKey = '1caQBCCly08w0vinpWmp1AK5ep8o6gsj';

    const handleSearchInput = (target) => {
            setsearchTerm(target.value);

    };

    const fetchGifs = () => {
        setsearching(true);
        fetch(`${url}api_key=${apiKey}&lang=fr&q=${searchTerm}&limit=${searchLimit}`)
            .then(res => res.json())
            .then(data => {
                setgifs(data.data);
                setsearching(false);
                setsearched(true)
            });
    };

    const onkeydown = (event) => {
        console.log('onKeyDown');
        if (event.keyCode === 13) {
            document.getElementById("searchGif").click();
        }
    };

    return (
        <React.Fragment >
            <div className="gif-container">
                <div className="gifBody">
                    <main>
                        <div className="container">
                            <div className="searchInput">
                                <div className="gif-search-container" onChange={ e => handleSearchInput(e.target) } >
                                    <div>
                                        <label htmlFor="search" className="gif-search-label">GIF Search:</label>
                                        <input type="text" id="search" className="gif-search-input gif-search-term" onKeyDown={onkeydown} disabled={!startTimer} placeholder="e.g. funny cats" />
                                    </div>
                                </div>
                                <Button className="margButt"  id="searchGif"variant="contained" color="primary" onClick={fetchGifs} disabled={!startTimer}>
                                    Search Gif
                                </Button>
                            </div>
                            { searching ? <Loader /> : null }
                            { !searching && searched ? <SearchOutput gifs={ gifs } sendGif={sendGif} /> : null }
                        </div>
                    </main>
                </div>
            </div>
        </React.Fragment >
    );
}
export default GifScreen;
