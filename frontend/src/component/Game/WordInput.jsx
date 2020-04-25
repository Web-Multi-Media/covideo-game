import React from 'react';
import Fab from "@material-ui/core/Fab";
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SkipNextIcon from '@material-ui/icons/SkipNext';

function WordInput(props) {
  return (<React.Fragment>
    {
      props.startTimer && <React.Fragment>
        <Fab className="margButt" variant="extended" color="primary" onClick={props.next}>
          <SkipNextIcon/>
          Skip
        </Fab>
        </React.Fragment>
    }
    {
      !props.startTimer &&
        <Fab className="margButt" variant="extended" color="primary" onClick={props.startRound}>
          <PlayCircleFilledIcon/>&nbsp;
          Start round
        </Fab>
    }
    </React.Fragment>
);
}

export default WordInput;
