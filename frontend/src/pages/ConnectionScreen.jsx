import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Players from "../component/Player/Players";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));

function ConnectionScreen(props) {
  const [textInput, setTextInput] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [wordSent, setWordSent] = useState(0);
  const [displayName, setdisplayName] = useState(false);
  const classes = useStyles();
  const words = [];
  const roomId = props.roomId;
  const player = props.player;
  const players = props.players;
  const isGameMaster = props.isGameMaster;
  const gameMaster = props.gameMaster;
  const room_url = `http://localhost:3000/${roomId}`;

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleWordChange = (event) => {
    setWordInput(event.target.value);
  };

  const sendName = () => {
    if (textInput !== '') {
      props.onSend(textInput);
      setTextInput('');
      setdisplayName(true);
    }
  };

  const sendWord = () => {
    if (wordInput !== '') {
      props.onSendWord(wordInput);
      setWordInput('');
      setWordSent(wordSent + 1);
    }
  };

  const gameIsReady = () => {
    props.onGameReady();
  };

  const kickPlayer = (name) => {
    props.kickPlayer(name);
  };

  const onkeydownName = (event) => {
    if (event.keyCode === 13 && !displayName) {
      document.getElementById("outlined-basic-name-input").click();
    }
  };

  const onkeydownWord = (event) => {
    if (event.keyCode === 13 && wordSent < 2) {
      document.getElementById("outlined-basic-word").click();
    }
  };

  return (<React.Fragment>
    <Players players={players} gameMaster={gameMaster} isGameMaster={isGameMaster} kickPlayer={kickPlayer}/>
    <h1>Your info</h1>
    <div className="inputLine">
      <TextField id="standard-basic" size="small" label="Username" variant="outlined" value={textInput} onKeyDown={onkeydownName} onChange={handleNameChange} disabled={displayName}/>
      <Button className="margButt" size="small" variant="contained" color="primary" onClick={sendName} disabled={displayName}>
        Set
      </Button>
    </div>
    <div className="inputLine">
      <TextField id="standard-basic" size="small" label="Mot" variant="outlined" value={wordInput} onKeyDown={onkeydownWord} onChange={handleWordChange} disabled={wordSent >= 2}/>
      <Button className="margButt" size="small" variant="contained" color="primary" onClick={sendWord} disabled={wordSent >= 2}>
        Add word ({wordSent}/2)
      </Button>
    </div>
    {
      props.isGameMaster && <React.Fragment>
          <div className="inputLine">
            <Button className="margButt" variant="contained" color="primary" onClick={gameIsReady} disabled={false}>
              Start game
            </Button>
          </div>
        </React.Fragment>
    }
    <h2>Room URL</h2>
    <Link href={room_url}>
      {room_url}
    </Link>
  </React.Fragment>);
}

export default ConnectionScreen;
