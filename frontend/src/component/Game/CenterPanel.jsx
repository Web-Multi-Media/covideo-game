import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import PlayerActivePanel from "./PlayerActivePanel";
import PlayerInactivePanel from "./PlayerInactivePanel";
import TopInformation from "./TopInformation";
import Grid from "@material-ui/core/Grid";
import WordInput from "./WordInput";
import Alert from "@material-ui/lab/Alert";

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
  },
  snackbarScoring:{
    position: 'initial',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  screenCenter: {
    width:'50%',
    height:'50%',
    position:'fixed',
    top:'25%',
    left:'25%',
    zIndex:100,
    textAlign:'center'
  }
}));

function CenterPanel(props) {
  const classes = useStyles();
  const isActivePlayer = props.currentPlayer.id === props.activePlayer.id;
  const [open, setOpen] = React.useState(isActivePlayer);
  const [openScoring, setOpenScoring] = React.useState(false);
  const [playerScoringName, setPlayerScoringName] = React.useState('');
  const [playerScoringWord, setPlayerScoringWord] = React.useState('');
  const handleClose = (event, reason) => {
    setOpen(false);
    setOpenScoring(false);
  };

  React.useEffect(() => {
    setOpen(isActivePlayer);
  }, [isActivePlayer]);

  React.useEffect(() => {
    if(props.wordScoring){
      setOpenScoring(true);
      setPlayerScoringName(props.playerScoring);
      setPlayerScoringWord(props.lastWordValidated);
      props.updateState({room: {wordScoring: false, playerScoring: '', lastWordValidated:''}})
    }
  }, [props.wordScoring]);


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
          roundDescription={props.roundDescription}
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
    <>

      <div className={classes.screenCenter}>
        <Snackbar
            className={classes.snackbarScoring}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            open={openScoring}
            autoHideDuration={2000}
            onClose={handleClose}
            TransitionComponent={TransitionRight}>
          <Alert onClose={handleClose} severity="success">
            <p>{playerScoringName} found {playerScoringWord}</p>
          </Alert>
        </Snackbar>
      </div>
    </>
      <Snackbar
        className={classes.snackbar}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={TransitionRight}
        message="It's your turn !"/>
    </Paper>
  </React.Fragment>);
}

export default CenterPanel;
