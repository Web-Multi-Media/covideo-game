import React, {useEffect, useState} from 'react';
import './WordInput.css'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));

function WordInput() {

    const [inRoom, setInRoom] = useState(false);

    useEffect(() => {
        console.log('use effect');
        if(inRoom) {
            console.log('joining room');
        }

        return () => {
            if(inRoom) {
                console.log('leaving room');

            }
        }
    });
    const classes = useStyles();

    const handleInRoom = () => {
        inRoom
            ? setInRoom(false)
            : setInRoom(true);
    }


    return (

        <div className="navBar">
            <h1>
                {inRoom && `You Have Entered The Room` }
                {!inRoom && `Outside Room` }
            </h1>

            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Input" variant="outlined" />
            </form>
            <Button className="margButt" variant="contained" color="primary">
                Validate
            </Button>
            <Button className="margButt" variant="contained" color="primary">
                Next Word
            </Button>

            <Button className="margButt" variant="contained" color="primary" onClick={() => handleInRoom()}>
                {inRoom && `Leave Room` }
                {!inRoom && `Enter Room` }
            </Button>

        </div>
    );
}

export default WordInput;
