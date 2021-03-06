import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GifPanel from "./GifPanel";
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
    minHeight: '61vh',
    marginBottom: '5px'
  },
}));

function PlayerActivePanel(props){
  const classes = useStyles();
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={2}>
    {!props.startTimer && <React.Fragment>
      <Typography variant='h5'>
        Start the round when you are ready !
      </Typography>
      </React.Fragment>
    }

    {/* Round < 3 is using voice to guess words */}
    {props.startTimer && props.set < 3 && <React.Fragment>
      <Typography variant='h3'>
        {props.wordToGuess}
      </Typography>
      <Typography variant='h5'>
        Players are still guessing ...
      </Typography>
      <div className={classes.loader}>
        <CircularProgress />
      </div>
        {props.roundDescription.map((message, index) =>
            <ChatMessage
                key={index}
                message={message.message}
                username={message.username}
            />,
        )}
      </React.Fragment>
    }

    {/* Round >=3 is using GIFs to guess words */}
    {props.startTimer && props.set >= 3 && <React.Fragment>
      <Typography variant='h3'>
        {props.wordToGuess}
      </Typography>
      {props.gifUrl !== '' && <React.Fragment>
        <Typography variant='h5'>You have sent your GIF !</Typography>
        <Paper elevation={5}>
          <img className="GuesserImg" src={props.gifUrl} alt="Powered By GIPHY"/>
        </Paper>
        </React.Fragment>
      }
      {props.gifUrl === '' && <React.Fragment>
        <Typography variant='h5'>Search and select a GIF !</Typography>
        <Paper elevation={5}>
          <GifPanel sendGif={props.sendGif} startTimer={props.startTimer}/>
        </Paper>
        </React.Fragment>
      }
      </React.Fragment>
    }
    </Paper>
  </React.Fragment>)
}

export default PlayerActivePanel;
