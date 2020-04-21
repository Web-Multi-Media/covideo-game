import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import PlayerActivePanel from "./PlayerActivePanel";
import PlayerInactivePanel from "./PlayerInactivePanel";
import TopInformation from "./TopInformation";
import Grid from "@material-ui/core/Grid";
import WordInput from "./WordInput";

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
  }
}));

function CenterPanel(props) {
  const classes = useStyles();
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
      {props.currentPlayer.id === props.activePlayer.id && <React.Fragment>
        <PlayerActivePanel
          currentPlayer={props.currentPlayer}
          gameMaster={props.gameMaster}
          roomSettings={props.roomSettings}
          set={props.set}
          roundDescription={props.roundDescription}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}
          wordToGuess={props.wordToGuess}/>
        </React.Fragment>
      }
      {props.currentPlayer.id !== props.activePlayer.id && <React.Fragment>
        <PlayerInactivePanel
          currentPlayer={props.currentPlayer}
          gameMaster={props.gameMaster}
          roomSettings={props.roomSettings}
          set={props.set}
          roundDescription={props.roundDescription}
          startTimer={props.startTimer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}/>
        </React.Fragment>
      }
      {props.currentPlayer.id === props.activePlayer.id &&
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={2}>
          <Grid container direction="row" justify="center" spacing={2}>

            <Grid item xs={12}>
              {
                props.currentPlayer.id === props.activePlayer.id && <React.Fragment>
                  <WordInput
                      startTimer={props.startTimer}
                      startRound={props.startRound}
                      validation={props.validateWord}
                      next={props.next}/>
                </React.Fragment>
              }
            </Grid>
            <Grid item xs={4}>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
        }
    </Paper>
  </React.Fragment>);
}

export default CenterPanel;
