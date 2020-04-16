import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import PlayerActivePanel from "./PlayerActivePanel";
import PlayerInactivePanel from "./PlayerInactivePanel";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  }
}));

function CenterPanel(props) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={3}>
      {props.currentPlayer.name === props.activePlayer && <React.Fragment>
        <PlayerActivePanel
          set={props.set}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}/>
        </React.Fragment>
      }
      {props.currentPlayer.name !== props.activePlayer && <React.Fragment>
        <PlayerInactivePanel
          set={props.set}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}/>
        </React.Fragment>
      }
    </Paper>
  </React.Fragment>);
}

export default CenterPanel;
