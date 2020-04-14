import React, {useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import SettingsIcon from '@material-ui/icons/Settings';
import TextIcon from '../TextIcon/TextIcon';
import './Rooms.css'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

function RoomSettings(props) {
  const classes = useStyles();
  const [timeToGuess1stRound, setTimeToGuess1stRound] = React.useState(props.roomSettings.timeToGuess1stRound);
  const [timeToGuess2ndRound, setTimeToGuess2ndRound] = React.useState(props.roomSettings.timeToGuess2ndRound);
  const [timeToGuess3rdRound, setTimeToGuess3rdRound] = React.useState(props.roomSettings.timeToGuess3rdRound);
  const [numWordsPerPlayer, setNumWordsPerPlayer] = React.useState(props.roomSettings.numWordsPerPlayer);
  const [numMaxPlayers, setNumMaxPlayers] = React.useState(props.roomSettings.numMaxPlayers);

  const handleOnChange = function() {
    const settings = {
      timeToGuess1stRound: timeToGuess1stRound,
      timeToGuess2ndRound: timeToGuess2ndRound,
      timeToGuess3rdRound: timeToGuess3rdRound,
      numWordsPerPlayer: numWordsPerPlayer,
      numMaxPlayers: numMaxPlayers,
    };
    props.onChangeSettings(settings);
  }

  useEffect(() => {
    handleOnChange();
  }, [timeToGuess1stRound, timeToGuess2ndRound, timeToGuess3rdRound, numWordsPerPlayer, numMaxPlayers]);

  return (<React.Fragment>
    <TextIcon size="h4" icon={<SettingsIcon fontSize="large"/>} text="Settings"/>
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-time-1st-round"
          type="number"
          label="Time first round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timeToGuess1stRound}
          onChange={(event) => {
            setTimeToGuess1stRound(parseInt(event.target.value));
          }}
        />
        <TextField
          id="standard-time-2nd-round"
          type="number"
          label="Time second round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timeToGuess2ndRound}
          onChange={(event) => setTimeToGuess2ndRound(parseInt(event.target.value))}
        />
        <TextField
          id="standard-time-3rd-round"
          type="number"
          label="Time third round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timeToGuess3rdRound}
          onChange={(event) => setTimeToGuess3rdRound(parseInt(event.target.value))}
        />
        <TextField
          id="standard-num-words"
          type="number"
          label="Number of words per player"
          disabled={!props.isGameMaster}
          value={props.roomSettings.numWordsPerPlayer}
          onChange={(event) => setNumWordsPerPlayer(parseInt(event.target.value))}
        />
        <TextField
          id="standard-num-max-players"
          type="number"
          label="Number of maximum players"
          disabled={!props.isGameMaster}
          value={props.roomSettings.numMaxPlayers}
          onChange={(event) => setNumMaxPlayers(parseInt(event.target.value))}
        />
      </div>
    </form>
  </React.Fragment>);
}

export default RoomSettings;
