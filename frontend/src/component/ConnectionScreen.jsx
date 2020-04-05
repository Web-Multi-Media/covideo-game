import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
const socket = io('http://localhost:8000');


function ConnectionScreen() {

    const [textInput, setTextInput] = useState('');

    const handleNameChange = (event) => {
        setTextInput(event.target.value);
    };

    useEffect(() => {
        socket.on('connected', ({message}) => {
            console.log('message');
            console.log(message);
            setTextInput(message)
        });
        socket.on('user Added', (obj) => {
            console.log('user Added');
            console.log(obj);
        });
    });



    const enterRoom = () => {
        console.log('enter room');
         socket.emit('enter Name', {name: textInput});
    };

    return (
        <React.Fragment>
            <p>Welcome to time's Up server</p>
            <p>Enter your username</p>
            <p>Your name is : {textInput}</p>
            <form  noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Input" variant="outlined" onChange={handleNameChange} />
            </form>
            <Button className="margButt" variant="contained" color="primary" onClick={enterRoom}>
                Validate
            </Button>
        </React.Fragment>
    );
}

export default ConnectionScreen;
