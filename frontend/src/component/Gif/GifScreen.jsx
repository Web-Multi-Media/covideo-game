import React, {useState} from "react";
import "./GifScreen.css";
import SearchInput from "./SearchInput";
import Loader from "./Loader";
import SearchOutput from "./SearchOutput";

function GifScreen({sendGif} ) {

        const [searchTerm, setsearchTerm] = useState( '');
        const searchLimit = 12;
        const [searching, setsearching] = useState( false);
        const [searched, setsearched] = useState( false);
        const [gifs, setgifs] = useState( []);
        const url= 'https://api.giphy.com/v1/gifs/search?';
        const apiKey = '1caQBCCly08w0vinpWmp1AK5ep8o6gsj';

    const handleSearchInput = (target) => {
            setsearchTerm(target.value);
            setsearching(true);
            fetchGifs();
    };

    const fetchGifs = () => {
        fetch(`${url}api_key=${apiKey}&q=${searchTerm}&limit=${searchLimit}&lang=fr`)
            .then(res => res.json())
            .then(data => {
                setgifs(data.data);
                setsearching(false);
                setsearched(true)
            });
    };

    return (
        <React.Fragment >
            <div className="gif-container">
                <div className="gifBody">
                    <main>
                        <div className="container">
                            <div className="searchInput">
                            <SearchInput handleSearchInput={ e => handleSearchInput(e.target) } />
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
