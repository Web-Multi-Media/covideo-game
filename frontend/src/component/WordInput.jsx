import React from 'react';
import './WordInput.css'
import Button from "@material-ui/core/Button";


function WordInput() {


    return (

        <div className="navBar">
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
