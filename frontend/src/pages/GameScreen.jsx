import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Typography from "@material-ui/core/Typography";
import CenterPanel from "../component/Game/CenterPanel";
import TeamPanel from "../component/Game/TeamPanel";
import PlayerAvatar from "../component/Player/PlayerAvatar";
import Round from "../component/Game/Round";
import Timer from "../component/Game/Timer";
import WordInput from "../component/Game/WordInput";
import TextIcon from "../component/TextIcon/TextIcon";

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
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();
  const handleChange = (event) => {
    setSpacing(Number(event.target.value));
  };
  const player = {
    id: 'noob',
    name: props.activePlayer
  };
  const playerAvatarGridProps = { justify: 'center' };

  return (<React.Fragment>
    <Grid container direction="row" justify="center" spacing={2} alignItems="stretch">

      {/* Top bar */}
      <Grid item xs={12}>
        <Grid container direction="row" justify="center" spacing={2}>

          {/* Active player card */}
          <Grid item xs={3} justify="left" alignItems="center">
            <Paper className={classes.paper} elevation={2}>
              <Typography className={classes.typography}>
                <b>Active player</b>
              </Typography>
              <PlayerAvatar
                player={props.currentPlayer}
                currentPlayer={props.currentPlayer}
                gameMaster={props.gameMaster}
                gridContainerProps={{playerAvatarGridProps}}/>
            </Paper>
          </Grid>

          {/* Round card */}
          <Grid item xs={6}>
            <Round set={props.set}/>
          </Grid>

          {/* Time left card */}
          <Grid item xs={3}>
            <Timer
              duration={props.roomSettings.timesToGuessPerSet[props.set]}
              startTimer={props.startTimer}/>
          </Grid>
        </Grid>
      </Grid>

      {/* Team panel (left) */}
      <Grid item xs={3}>
        <TeamPanel
          team={props.teams[0]}
          teamScore={props.team1Score}
          teamNumber={1}
          gameMaster={props.gameMaster}
          activePlayer={props.activePlayer}
          currentPlayer={props.currentPlayer}/>
      </Grid>

      {/* Game panel (center) */}
      <Grid item xs={6}>
        <CenterPanel
          currentPlayer={props.currentPlayer}
          activePlayer={props.activePlayer}
          gifUrl={props.gifUrl}
          sendGif={props.sendGif}
          startTimer={props.startTimer}
          word={props.words[0]}
          set={props.set}/>
      </Grid>

      {/* Team panel (left) */}
      <Grid item xs={3}>
        <TeamPanel
          team={props.teams[1]}
          teamScore={props.team2Score}
          teamNumber={2}
          gameMaster={props.gameMaster}
          activePlayer={props.activePlayer}
          currentPlayer={props.currentPlayer}/>
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
                props.currentPlayer.name === props.activePlayer && <React.Fragment>
                  <WordInput
                    startTimer={props.startTimer}
                    wordToGuess={props.words[0]}
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
