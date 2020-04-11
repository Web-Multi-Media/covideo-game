import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";


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

    const playerList = props.users ? props.users.map(user => <p>{user}</p>) : [];

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

    const onkeydown = ( event) => {
    if (event.keyCode === 13) {
        document.getElementById("outlined-basic-name").click();
    }
    };

    return (
        <React.Fragment>
            <p>Welcome to time's Up server</p>
            <p>Player List</p>
            {playerList}
            {displayName && <p>Your name is : {textInput}</p>}
            <p>Enter your username</p>
            <div className="inputLine">
                    <TextField id="outlined-basic" label="nom" variant="outlined" value={textInput} onKeyDown={onkeydown('test')} onChange={handleNameChange} />
                <Button  id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={enterRoom}  disabled={displayName}>
                    Validate
                </Button>
            </div>
            <p>Enter words</p>
            <div  className="inputLine">
                    <TextField id="outlined-basic" label="Mot" variant="outlined" value={wordInput} onChange={handleWordChange} />
                <Button className="margButt" variant="contained" color="primary" onClick={sendWord} disabled={wordSent >= 2}>
                    Validate
                </Button>
            </div>
            {props.isGameMaster &&
            <React.Fragment>
                <p>Is game Ready</p>
                <div  className="inputLine">
                    <Button className="margButt" variant="contained" color="primary" onClick={gameIsReady} disabled={false}>
                        Ready
                    </Button>
                </div>
            </React.Fragment>
            }
            <p> link to join the room : http://localhost:3000/{props.roomId}</p>
        </React.Fragment>
    );
}

export default ConnectionScreen;
