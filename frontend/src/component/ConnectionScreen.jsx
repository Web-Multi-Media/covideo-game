import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Players from "./Players";

function ConnectionScreen(props) {
  const [textInput, setTextInput] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [wordSent, setWordSent] = useState(0);
  const [displayName, setdisplayName] = useState(false);

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleWordChange = (event) => {
    setWordInput(event.target.value);
  };

  const players = props.players;
  const roomId = props.roomId;

  const enterRoom = () => {
    props.onSend(textInput);
    setTextInput('');
    setdisplayName(true);
  };

  const sendWord = () => {
    props.onSendWord(wordInput);
    setWordInput('');
    setWordSent(wordSent + 1);
  };

  const gameIsReady = () => {
    props.onGameReady();
  };

  const kickPlayer = (name) => {
    props.kickPlayer(name);
  };

  const onkeydown = (event) => {
    if (event.keyCode === 13) {
      document.getElementById("outlined-basic-name").click();
    }
  };

  const room_url = `http://localhost:3000/${roomId}`;

  return (<React.Fragment>
      <h1>Welcome to Time's Up server</h1>
      <h2>Room id: {roomId}</h2>
      <Players players={players} kickPlayer={kickPlayer}/>
      <p>Enter your username</p>
      <div className="inputLine">
        <TextField id="outlined-basic" label="nom" variant="outlined" value={textInput} onKeyDown={onkeydown('test')} onChange={handleNameChange}/>
        <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={enterRoom} disabled={displayName}>
          Validate
        </Button>
      </div>
      <p>Enter words</p>
      <div className="inputLine">
        <TextField id="outlined-basic" label="Mot" variant="outlined" value={wordInput} onChange={handleWordChange}/>
        <Button className="margButt" variant="contained" color="primary" onClick={sendWord} disabled={wordSent >= 2}>
          Validate
        </Button>
      </div>
      {
        props.isGameMaster && <React.Fragment>
            <p>Is game Ready</p>
            <div className="inputLine">
              <Button className="margButt" variant="contained" color="primary" onClick={gameIsReady} disabled={false}>
                Ready
              </Button>
            </div>
          </React.Fragment>
      }
      <h2>Room URL</h2>
      <p>{room_url}</p>
  </React.Fragment>);
}

export default ConnectionScreen;
