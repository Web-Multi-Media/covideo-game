import React from 'react';
import './GuesserScreen.css'

function GuesserScreen(props) {
  return (<div className="GuesserScreen">
    <img className="GuesserImg" src={props.gifUrl === ''
        ? "https://www.bfmtv.com/i/0/0/1a7/1775b09977041baa4a1294763bfb2.jpg"
        : props.gifUrl
} alt="Powered By GIPHY"/>
  </div>);
}

export default GuesserScreen;
