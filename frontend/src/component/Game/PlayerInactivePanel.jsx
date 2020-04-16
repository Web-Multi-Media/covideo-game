import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import './PlayerInactivePanel.css'
import TopInformation from "./TopInformation";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px',
    minHeight: '64vh'
  },
}));

function PlayerInactivePanel(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={2}>
    {!props.startTimer &&
      <Typography variant='h5'>
        Waiting for round to start ...
      </Typography>
    }

    {/* Round < 3 is using voice to guess words */}
    {props.startTimer && props.set < 3 &&
      <Typography variant='h5'>
        What is the word ? Make your guess !!!
      </Typography>
    }

    {/* Round >=3 is using GIFs to guess words */}
    {props.startTimer && props.set >= 3 && <React.Fragment>
      {props.gifUrl !== '' && <React.Fragment>
        <Typography variant='h5'>
        Guess the word using the GIF below !
        </Typography>
        <img className="GuesserImg" src={props.gifUrl} alt="Powered By GIPHY"/>
        </React.Fragment>
      }
      {props.gifUrl === '' && <React.Fragment>
        <Typography variant='h5'>
          Waiting on GIF ...
        </Typography>
        </React.Fragment>
      }
      </React.Fragment>
    }
    </Paper>
  </React.Fragment>);
}

export default PlayerInactivePanel;
