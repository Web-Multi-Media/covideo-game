import React, {useEffect, useState} from 'react';
import './Timer.css'

function Timer(props) {

    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    function reset(duration) {
        setSeconds(duration);
        setIsActive(true);
    }

    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0 ) {
            if (props.setFinished === true){
                setSeconds(0);
                props.timerEnd();
                clearInterval(interval)
            } else{
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 0.1);
            }, 100);
            }
        }
        if (isActive && seconds <= 0 ) {
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
        <div className="timer">
            <p>Timer : {Math.trunc(seconds)} sec</p>
        </div>
    );
}

export default Timer;
