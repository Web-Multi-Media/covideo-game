import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Typography from "@material-ui/core/Typography";
import CenterPanel from "../component/Game/CenterPanel";
import TeamPanel from "../component/Game/TeamPanel";
import WordInput from "../component/Game/WordInput";
import TextIcon from "../component/TextIcon/TextIcon";
import Chat from "../component/Chat/Chat";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
  control: {
    padding: theme.spacing(2)
  },
  typography: {
    ...theme.typography.button,
    fontSize: "1.2rem"
  }
}));

function GameScreen(props) {
  const classes = useStyles();

  useEffect(() => {
    if (props.currentPlayer.id === props.activePlayer.id) {
      setTimeout(() => props.playSound('startRoundActivePlayer'), 500)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activePlayer.id]);

  useEffect(() => {
    if (props.team1Score > 0 || props.team2Score > 0) {
      props.playSound('guessWord');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.team1Score, props.team2Score]);

  return (<React.Fragment>
    <Grid container direction="row" justify="center" spacing={2} alignItems="stretch">

      {/* Team panel (left) */}
      <Grid item xs={2}>
        <TeamPanel
          teams={props.teams}
          team1Score={props.team1Score}
          team2Score={props.team2Score}
          gameMaster={props.gameMaster}
          activePlayer={props.activePlayer}
          currentPlayer={props.currentPlayer}/>
      </Grid>

      {/* Game panel (center) */}
      <Grid item xs={4}>
        <CenterPanel
          currentPlayer={props.currentPlayer}
          gameMaster={props.gameMaster}
          set={props.set}
          roomSettings={props.roomSettings}
          startTimer={props.startTimer}
          activePlayer={props.activePlayer}
          gifUrl={props.gifUrl}
          wordToGuess={props.wordToGuess}
          sendGif={props.sendGif}
          playSound={props.playSound}/>
      </Grid>

      <Grid item xs={4}>
        <Chat
          sendChatMessage={props.sendChatMessage}
          incomingChatMessage={props.incomingChatMessage}
        />
      </Grid>
      {/* Bottom bar */}
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={2}>
          <Grid container direction="row" justify="center" spacing={2}>
            <Grid item xs={4}>
              {props.wordsValidated.length > 0 && <React.Fragment>
              <TextIcon size="h8" icon={<CheckCircleIcon fontSize="large"/>} text="Validated words"/>
                {
                  props.wordsValidated.map((word) => (<React.Fragment>
                    <Typography>{word}</Typography>
                    </React.Fragment>))
                }
              </React.Fragment>
              }
            </Grid>
            <Grid item xs={4}>
              {
                props.currentPlayer.id === props.activePlayer.id && <React.Fragment>
                  <WordInput
                    startTimer={props.startTimer}
                    startRound={props.startRound}
                    validation={props.validateWord}
                    next={props.nextWord}/>
                </React.Fragment>
              }
            </Grid>
            <Grid item xs={4}>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  </React.Fragment>);
}

export default GameScreen;
