import React from 'react';
import Typography from "@material-ui/core/Typography";
import alarmClock from './alarm-clock.png';
import {makeStyles} from '@material-ui/core/styles';
import './Header.css';

const useStyles = makeStyles({
  typography: {
    textAlign: 'center'
  }
})

function Header(props) {
  const classes = useStyles();
  const style = {
    'display': 'block',
    'marginLeft': 'auto',
    'marginRight': 'auto',
    'width': '8%'
  }
  return (<React.Fragment>
    <div className='header'>
    <img style={style} src={alarmClock} alt="Alarm Clock Logo"/>
    <Typography className={classes.typography} variant="h3">
      Welcome to Time's Up server !
    </Typography>
    </div>
  </React.Fragment>)
}

export default Header;
