import React from 'react';
import './GuessScreen.css'


function GuessScreen(props) {

    return (<div className="GuesserScreen">
        <img className="GuesserImg"
             src={
                 props.gifUrl === '' ?
                 "https://www.bfmtv.com/i/0/0/1a7/1775b09977041baa4a1294763bfb2.jpg" :
                 props.gifUrl
             }
        />
    </div>);
}

export default GuessScreen;
