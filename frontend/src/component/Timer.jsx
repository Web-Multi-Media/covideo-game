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
        interval = setInterval(() => {
          setSeconds(seconds => seconds - 1);
        }, 1000);
      }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if(props.startTimer === true){
      reset(props.duration);
    }
    if(props.startTimer === false){
      setSeconds(0);
    }

  }, [props.startTimer]);

  return (
      <div className="timer">
        <p>Timer : {seconds}</p>
      </div>
  );
}

export default Timer;
