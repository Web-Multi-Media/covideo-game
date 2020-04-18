import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import PlayerActivePanel from "./PlayerActivePanel";
import PlayerInactivePanel from "./PlayerInactivePanel";
import TopInformation from "./TopInformation";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  }
}));

function CenterPanel(props) {

  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={3}>
      <TopInformation
          currentPlayer={props.activePlayer}
          gameMaster={props.gameMaster}
          set={props.set}
          roomSettings={props.roomSettings}
          startTimer={props.startTimer}
          playSound={props.playSound}
      />
      {props.currentPlayer.id === props.activePlayer.id && <React.Fragment>
        <PlayerActivePanel
          currentPlayer={props.currentPlayer}
          gameMaster={props.gameMaster}
          roomSettings={props.roomSettings}
          set={props.set}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}
          word={props.word}/>
        </React.Fragment>
      }
      {props.currentPlayer.id !== props.activePlayer.id && <React.Fragment>
        <PlayerInactivePanel
            currentPlayer={props.currentPlayer}
            gameMaster={props.gameMaster}
            roomSettings={props.roomSettings}
            set={props.set}
            startTimer={props.startTimer}
            gifUrl={props.gifUrl}
            sendGif={props.sendGif}/>
        </React.Fragment>
      }
    </Paper>
  </React.Fragment>);
}

export default CenterPanel;
