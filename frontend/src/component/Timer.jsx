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
        console.log(props.setFinished);
        console.log(isActive);
        let interval = null;
        if (isActive && seconds > 0 ) {
            if (props.setFinished === true){
                interval = setInterval(() => {
                setSeconds(0);
                props.timerEnd();
                }, 50);
            } else{
            interval = setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            }
        }
        else if (isActive &&seconds === 0 ) {
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
            <p>Timer : {seconds} sec</p>
        </div>
    );
}

export default Timer;
