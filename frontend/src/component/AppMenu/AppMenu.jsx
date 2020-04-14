import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/core/Icon";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import alarmClock from "./alarm-clock.png";

const useStyles = makeStyles({});
const style = {
  // 'width': 'auto',
  // 'max-width': '3%',
  // 'min-width': '3%',
  // 'display': 'inline',
  'margin-right': '5px',
  'padding-bottom': '5px',
  'width': '50px',
  'height': '50px'
}

function AppMenu(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <AppBar position="static">
    <Toolbar classes='toolbar'>
      <IconButton size="small" edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
      <img style={style} src={alarmClock} alt="Alarm Clock Logo"/>
      </IconButton>
      <Typography noWrap variant="h6" className={classes.title}>
        Time's Up !
      </Typography>
    </Toolbar>
  </AppBar>
  </React.Fragment>);
}

export default AppMenu;
