import React from 'react';
import Button from "@material-ui/core/Button";

function WordInput(props) {

  return (<React.Fragment>
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
    </React.Fragment>
);
}

export default WordInput;
