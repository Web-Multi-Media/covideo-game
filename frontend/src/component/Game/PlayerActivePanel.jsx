import React from 'react'
import {makeStyles} from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GifPanel from "./GifPanel";
import TopInformation from "./TopInformation";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '10px'
  },
}));

function PlayerActivePanel(props){
  const classes = useStyles();
  console.log(props.gifUrl);
  return (<React.Fragment>
    <Paper className={classes.paper} elevation={2}>

    {!props.startTimer &&
      <Typography variant='h5'>
        Start the round when you are ready !
      </Typography>
    }

    {/* Round < 3 is using voice to guess words */}
    {props.startTimer && props.set < 3 &&
      <Typography variant='h5'>
        Players are still guessing ...
      </Typography>
    }

    {/* Round >=3 is using GIFs to guess words */}
    {props.startTimer && props.set >= 3 && <React.Fragment>
      {props.gifUrl !== '' && <React.Fragment>
        <Typography>You have sent your GIF !</Typography>
        <img className="GuesserImg" src={props.gifUrl} alt="Powered By GIPHY"/>
        </React.Fragment>
      }
      {props.gifUrl === '' && <React.Fragment>
        <GifPanel sendGif={props.sendGif} startTimer={props.startTimer}/>
        </React.Fragment>
      }
      </React.Fragment>
    }
    </Paper>
  </React.Fragment>)
}

export default PlayerActivePanel;
