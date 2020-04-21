import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import PlayerActivePanel from "./PlayerActivePanel";
import PlayerInactivePanel from "./PlayerInactivePanel";
import TopInformation from "./TopInformation";

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
  grid: {
    display :'grid',
  },
  snackbar: {
    textAlign: 'center'
  }
}));

function CenterPanel(props) {
  const classes = useStyles();
  const isActivePlayer = props.currentPlayer.id === props.activePlayer.id;
  const [open, setOpen] = React.useState(isActivePlayer);
  const handleClose = (event, reason) => {
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(isActivePlayer);
  }, [isActivePlayer]);

  return (<React.Fragment>
    <Paper className={classes.paper} elevation={3}>
      {/* <p>props.currentPlayer {JSON.stringify(props.currentPlayer)}</p> */}
      {/* <p>props.activePlayer {JSON.stringify(props.activePlayer)}</p> */}
      <TopInformation
        currentPlayer={props.activePlayer}
        gameMaster={props.gameMaster}
        set={props.set}
        roomSettings={props.roomSettings}
        startTimer={props.startTimer}
        playSound={props.playSound}/>
      {isActivePlayer && <React.Fragment>
        <PlayerActivePanel
          currentPlayer={props.currentPlayer}
          gameMaster={props.gameMaster}
          roomSettings={props.roomSettings}
          set={props.set}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}
          wordToGuess={props.wordToGuess}/>
        </React.Fragment>
      }
      {!isActivePlayer && <React.Fragment>
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
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        TransitionComponent={TransitionRight}
        message="It's your turn !"/>
    </Paper>
  </React.Fragment>);
}

export default CenterPanel;
