import React from 'react';
import './WordInput.css'
import Button from "@material-ui/core/Button";

function WordInput(props) {

  return (<div className="navBar">
    {
      props.startTimer && <React.Fragment>
          <p>Word to guess : {props.wordToGuess}
          </p>
          <Button className="margButt" variant="contained" color="primary" onClick={props.validation}>
            Validate
          </Button>
          &nbsp;
          <Button className="margButt" variant="contained" color="primary" onClick={props.next}>
            Next Word
          </Button>
        </React.Fragment>
    }
    {
      !props.startTimer && <Button className="margButt" variant="contained" color="primary" onClick={props.startRound}>
          startRound
        </Button>
    }
  </div>);
}

export default WordInput;
