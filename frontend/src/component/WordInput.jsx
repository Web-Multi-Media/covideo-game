import React from 'react';
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
    const classes = useStyles();

    return (

        <div className="navBar">
            <form className={classes.root} noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Input" variant="outlined" />
            </form>
            <Button className="margButt" variant="contained" color="primary">
                Validate
            </Button>
            <Button className="margButt" variant="contained" color="primary">
                Next Word
            </Button>
        </div>
    );
}

export default WordInput;
