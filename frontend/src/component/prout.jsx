class App extends React.Component {

    state = {
        searchTerm: '',
        searchLimit: 30,
        searching: false,
        searched: false,
        gifs: [],
        url: 'https://api.giphy.com/v1/gifs/search?',
        apiKey: '1caQBCCly08w0vinpWmp1AK5ep8o6gsj'
    }

    handleSearchInput = debounce(target => {
        target.className.includes('gif-search-term') ?
            this.setState({ searchTerm: target.value, searching: true }, this.fetchGifs) :
            this.setState({ searchLimit: target.value <= 200 ? target.value : 200, searching: true }, this.fetchGifs);
    });

    fetchGifs = () => {
        fetch(`${this.state.url}api_key=${this.state.apiKey}&q=${this.state.searchTerm}&limit=${this.state.searchLimit}`)
            .then(res => res.json())
            .then(data => this.setState({ gifs: data.data, searching: false, searched: true }));
    }

    render() {
        return (
            <React.Fragment >
                <header>
                    <h1><span className="giphy-logo">GIPHY</span> <span>Search API</span></h1>
                </header>
                <main>
                    <div className="container">
                        <SearchInput handleSearchInput={ e => this.handleSearchInput(e.target) } />
                        { this.state.searching ? <Loader /> : null }
                        { !this.state.searching && this.state.searched ? <SearchOutput gifs={ this.state.gifs } /> : null }
                    </div>
                </main>
                <footer>
                    <a href="https://developers.giphy.com/">
                        <img src="http://www.georgewpark.com/images/codepen/giphy-attribution.png" alt="Powered By GIPHY" />
                    </a>
                </footer>
            </React.Fragment >
        );
    }
}

function SearchInput({ handleSearchInput }) {
    return (
        <div className="gif-search-container" onChange={ handleSearchInput } >
            <div>
                <label htmlFor="search" className="gif-search-label">GIF Search:</label>
                <input type="text" id="search" className="gif-search-input gif-search-term" placeholder="e.g. funny cats" />
            </div>

            <div>
                <label htmlFor="limit" className="gif-search-label">No. of GIFs:</label>
                <input type="number" id="search" className="gif-search-input gif-search-limit" placeholder="e.g. 30" defaultValue="30" />
            </div>
        </div>
    );
}



function Gif({ gif }) {
    return (
        <div className="gif-container">
            <a href={ gif.images.original.url } target="_blank">
                <img src={ gif.images.fixed_width_downsampled.url } className="gif" />
            </a>
        </div>
    );
}

function Loader() {
    return <div className="loader"></div>;
}

function debounce(func, wait = 800) {

    let timeout;

    return function () {
        const context = this,
            args = arguments;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

ReactDOM.render(<App />, document.querySelector('#root'));