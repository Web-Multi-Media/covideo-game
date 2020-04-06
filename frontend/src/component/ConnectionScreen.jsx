import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";


function ConnectionScreen(props) {
    const [textInput, setTextInput] = useState('');
    const [displayName, setdisplayName] = useState(false);

    const handleNameChange = (event) => {
        setTextInput(event.target.value);
    };

    const playerList = props.users ? props.users.map(user => <p>{user}</p>) : [];

    const enterRoom = () => {
        console.log('enter room');
        props.onSend(textInput);
        setdisplayName(true);
    };

    return (
        <React.Fragment>
            <p>Welcome to time's Up server</p>
            <p>Player List</p>
            {playerList}
            <p>Enter your username</p>
            {displayName && <p>Your name is : {textInput}</p>}
            <form  noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Input" variant="outlined" onChange={handleNameChange} />
            </form>
            <Button className="margButt" variant="contained" color="primary" onClick={enterRoom} disabled={displayName}>
                Validate
            </Button>
        </React.Fragment>
    );
}

export default ConnectionScreen;
