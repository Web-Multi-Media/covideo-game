import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px',
  },
  typography: {
    ...theme.typography.button,
    fontSize: "1.2rem"
  }
}));

function Timer(props) {
  const classes = useStyles();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const style = {
    width: 50,
    height: 50,
    textAlign: 'center',
    borderRadius: '50%',
    color: `${seconds < 5 ? 'red' : 'black'}`,
    margin: '0 auto',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }

  function reset(duration) {
    setSeconds(duration);
    setIsActive(true);
  }

  function playTickTock() {
    props.playSound("tick", 0.005);
    setTimeout(() => {
      props.playSound("tock", 0.005);
    }, 500);
  }

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
        // play tick tock until timer has 3 second left
        if (seconds > 3) {
          playTickTock();
        }
      }, 1000);
    }
    return() => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (props.startTimer === true) {
      reset(props.duration);
      props.playSound('startRound');
    }
    if (props.startTimer === false) {
      setSeconds(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.startTimer, props.duration]);

  useEffect(() => {
    if (isActive && seconds === 3) {
      props.playSound('timerEndSoon');
    } else if (isActive && seconds === 0) {
      props.playSound('endRoundlooser');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  return (<React.Fragment>
    <Paper className={classes.paper} elevation={3}>
      <Typography className={classes.typography}><b>Time</b></Typography>
      <Paper elevation={3} style={style}>
        <Typography variant="h4" align="center">
          {seconds}
        </Typography>
      </Paper>
    </Paper>
  </React.Fragment>);
}

export default Timer;
