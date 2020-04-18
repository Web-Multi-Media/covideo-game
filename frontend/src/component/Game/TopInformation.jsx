import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PlayerAvatar from "../Player/PlayerAvatar";
import Round from "./Round";
import Timer from "./Timer";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

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

function TopInformation(props) {
  const playerAvatarGridProps = { justify: 'center' };
  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" spacing={2} alignItems="stretch">
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
              startTimer={props.startTimer}
              playSound={props.playSound}/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TopInformation;
