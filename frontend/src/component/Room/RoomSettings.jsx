import React, {useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
  const [timeToGuess1stRound, setTimeToGuess1stRound] = React.useState(props.roomSettings.timesToGuessPerSet[0]);
  const [timeToGuess2ndRound, setTimeToGuess2ndRound] = React.useState(props.roomSettings.timesToGuessPerSet[1]);
  const [timeToGuess3rdRound, setTimeToGuess3rdRound] = React.useState(props.roomSettings.timesToGuessPerSet[2]);
  const [numWordsPerPlayer, setNumWordsPerPlayer] = React.useState(props.roomSettings.numWordsPerPlayer);
  const [numMaxPlayers, setNumMaxPlayers] = React.useState(props.roomSettings.numMaxPlayers);
  const [privateRoom, setPrivateRoom] = React.useState(props.roomSettings.private);

  const handleOnChange = function() {
    const settings = {
      timesToGuessPerSet: [timeToGuess1stRound, timeToGuess2ndRound, timeToGuess3rdRound],
      numWordsPerPlayer: numWordsPerPlayer,
      numMaxPlayers: numMaxPlayers,
      private: privateRoom
    };
    props.onChangeSettings(settings);
  }

  useEffect(() => {
    handleOnChange();
  }, [timeToGuess1stRound, timeToGuess2ndRound, timeToGuess3rdRound, numWordsPerPlayer, numMaxPlayers, privateRoom]);

  return (<React.Fragment>
    <TextIcon size="h4" icon={<SettingsIcon fontSize="large"/>} text="Settings"/>
    <form className={classes.root} noValidate autoComplete="off">
      <div>
        <TextField
          id="standard-time-1st-round"
          type="number"
          label="Time first round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timesToGuessPerSet[0]}
          onChange={(event) => setTimeToGuess1stRound(parseInt(event.target.value))}
        />
        <TextField
          id="standard-time-2nd-round"
          type="number"
          label="Time second round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timesToGuessPerSet[1]}
          onChange={(event) => setTimeToGuess2ndRound(parseInt(event.target.value))}
        />
        <TextField
          id="standard-time-3rd-round"
          type="number"
          label="Time third round"
          disabled={!props.isGameMaster}
          value={props.roomSettings.timesToGuessPerSet[2]}
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
        <FormControlLabel
          value="left"
          control={
            <Checkbox
              color="primary"
              checked={props.roomSettings.private}
              disabled={!props.isGameMaster}
              onChange={(event) => setPrivateRoom(event.target.checked)}
            />
          }
          label="Private"
          labelPlacement="left"
        />
      </div>
    </form>
  </React.Fragment>);
}

export default RoomSettings;
