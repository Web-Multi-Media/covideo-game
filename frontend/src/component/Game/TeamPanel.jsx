import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlayerAvatar from "../Player/PlayerAvatar";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
  typography: {
    ...theme.typography.button,
    fontSize: '1.2rem'
  },
  grid:{
    display: 'grid',
    gridRowGap: '5px',
    gridTemplateRows: 'repeat(2, auto)',
    height: '100%'
  },
  firstRow:{
    padding: '20px',
    gridRow: '1 / 2'
  },
  secondRow:{
    padding: '20px',
    gridRow: '2 / 3'
  }

}));

function TeamPanel(props) {
  const classes = useStyles();
  const teams = props.teams;
  const teamMembers1 = teams[0].map(player => {
    return (<React.Fragment key={player.name}>
      <Grid item>
        <PlayerAvatar
          player = {player}
          gameMaster = {props.gameMaster}
          displayPlayerName = {true}
          currentPlayer = {props.currentPlayer}/>
      </Grid>
    </React.Fragment>);
  });
  const teamMembers2 = teams[1].map(player => {
    return (<React.Fragment key={player.name}>
      <Grid item>
        <PlayerAvatar
          player = {player}
          gameMaster = {props.gameMaster}
          displayPlayerName = {true}
          currentPlayer = {props.currentPlayer}/>
      </Grid>
    </React.Fragment>);
  });
  return (<React.Fragment>
      <div className={classes.grid}>
        <Paper className={classes.firstRow} elevation={1}>
          <Typography className={classes.typography}>
            <b>Team 1</b>
          </Typography>
          <Typography variant='button'>
            Score : {props.team1Score}
          </Typography>
          <Grid container>
            {teamMembers1}
          </Grid>
        </Paper>
          <Paper className={classes.secondRow} elevation={3}>
            <Typography className={classes.typography}>
              <b>Team 2</b>
            </Typography>
            <Typography variant='button'>
              Score : {props.team2Score}
            </Typography>
            <Grid container>
              {teamMembers2}
            </Grid>
          </Paper>
      </div>
  </React.Fragment>);
}

export default TeamPanel;
