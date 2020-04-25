import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import './PlayerInactivePanel.css'
import ChatMessage from "../Chat/ChatMessage";

const useStyles = makeStyles((theme) => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px',
    minHeight: '72vh'
  },
}));

function PlayerInactivePanel(props) {
  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={2}>
    {!props.startTimer && <React.Fragment>
      <Typography variant='h5'>
        Waiting for active player to start round ...
      </Typography>
      <div className={classes.loader}>
        <CircularProgress />
      </div>
      </React.Fragment>
    }

    {/* Round < 3 is using voice to guess words */}
    {props.startTimer && props.set < 3 &&
    <>
    <Typography variant='h5'>
        What is the word ? Make your guess !!!
      </Typography>
      {props.roundDescription.map((message, index) =>
          <ChatMessage
              key={index}
              message={message.message}
              username={message.username}
          />,
      )}
    </>
    }

    {/* Round >=3 is using GIFs to guess words */}
    {props.startTimer && props.set >= 3 && <React.Fragment>
      {props.gifUrl !== '' && <React.Fragment>
        <Typography variant='h5'>
        Guess the word using the GIF below !
        </Typography>
        <Paper elevation={5}>
          <img className="GuesserImg" src={props.gifUrl} alt="Powered By GIPHY"/>
        </Paper>
        </React.Fragment>
      }
      {props.gifUrl === '' && <React.Fragment>
        <Typography variant='h5'>
          Waiting on active player to choose a GIF ...
        </Typography>
        <div className={classes.loader}>
          <CircularProgress />
        </div>
        </React.Fragment>
      }
      </React.Fragment>
    }
    </Paper>
  </React.Fragment>);
}

export default PlayerInactivePanel;
