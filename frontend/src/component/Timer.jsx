import React, {useEffect, useState} from 'react';
import './Timer.css'

function Timer(props) {

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isDone, setIsDone] = useState(false);



    function reset(duration) {
        setSeconds(duration);
        setIsActive(true);
    }

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0 ) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        }
        else if (isActive && seconds === 0) {
            setIsDone(true);
            props.timerEnd();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    useEffect(() => {
        if(props.startTimer === true){
            reset(props.timerDuration);
        }
    }, [props.startTimer]);




    return (
        <div className="app">
            <div className="time">
                {seconds}s
            </div>
            <div className="row">
                <button className="button" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
