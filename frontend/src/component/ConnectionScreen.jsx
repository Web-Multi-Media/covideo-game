import React, {useEffect, useState} from 'react';
import "./ConnectionScreen.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";


function ConnectionScreen(props) {

    const [textInput, setTextInput] = useState('');

    const handleNameChange = (event) => {
        setTextInput(event.target.value);
    };

    useEffect(() => {

    });



    const enterRoom = () => {
        console.log('enter room');
        props.onSend(textInput);
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
