import React from 'react';
import './Timer.css'

function Timer(props) {


    return (
        <div className="timer">
            <p>Timer : {Math.trunc(props.timeLeft)} sec</p>
        </div>
    );
}

export default Timer;
