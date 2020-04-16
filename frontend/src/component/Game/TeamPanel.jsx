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
  }
}));

function TeamPanel(props) {
  const classes = useStyles();
  const team = props.team;
  const teamMembers = team.map(player => {
    const playerData = {id: 'noob', name: player};
    return (<React.Fragment>
      <Grid item>
      <PlayerAvatar
        player = {playerData}
        gameMaster = {props.gameMaster}
        currentPlayer = {props.currentPlayer}/>
      </Grid>
    </React.Fragment>);
  });
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={2}>
    <Typography className={classes.typography}><b>Team {props.teamNumber}</b></Typography>
    <Typography variant='h8'>Score : {props.teamScore}</Typography>
    <Grid container>
    {teamMembers}
    </Grid>
    </Paper>
  </React.Fragment>);
}

export default TeamPanel;
