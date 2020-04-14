import React, {useEffect, useState} from 'react';
import "./RoomScreen.css";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AddIcon from '@material-ui/icons/Add';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Players from "../component/Player/Players";
import RoomSettings from "../component/Room/RoomSettings";
import RoomShare from "../component/Room/RoomShare";
import TextIcon from "../component/TextIcon/TextIcon";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1)
  },
  button: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 80,
    paddingRight: 80,
    margin: 20,
    textSize: "large"
  },
  paper: {
    padding: 20
  }
}));

function RoomScreen(props) {
  const classes = useStyles();
  const [wordInput, setWordInput] = useState('');
  const [wordSent, setWordSent] = useState(0);
  const [words, setWords] = useState([]);
  const roomId = props.roomId;
  const player = props.player;
  const players = props.players;
  const isGameMaster = props.isGameMaster;
  const gameMaster = props.gameMaster;
  const currentPlayer = props.currentPlayer;
  const room_url = `http://localhost:3000/${roomId}`;

  const handleWordChange = (event) => {
    setWordInput(event.target.value);
  };

  const handleWordDelete = name => event => {
    console.log(name);
    setWords(words.filter(word => word !== name));
    setWordSent(wordSent - 1);
  }

  const sendWord = () => {
    if (wordInput !== '') {
      props.onSendWord(wordInput);
      setWordInput('');
      setWordSent(wordSent + 1);
      words.push(wordInput);
      setWords(words);
    }
  };

  const gameIsReady = () => {
    props.onGameReady();
  };

  const kickPlayer = (name) => {
    props.kickPlayer(name);
  };

  const onkeydownWord = (event) => {
    if (event.keyCode === 13 && wordSent < 2) {
      document.getElementById("outlined-basic-word").click();
    }
  };

  return (<React.Fragment>
    <Paper className={classes.paper}>
    <Grid container spacing={2}>
      <Grid item xs={5}>
      <RoomSettings isGameMaster={isGameMaster}/>
      </Grid>

      <Divider orientation="vertical" flexItem/>

      <Grid item xs={5}>
      <Players
        players={players}
        currentPlayer={currentPlayer}
        gameMaster={gameMaster}
        isGameMaster={isGameMaster}
        kickPlayer={kickPlayer}
        onSendUsername={props.onSendUsername}/>
      </Grid>

      <Divider flexItem />

      <Grid item xs={5}>
      <RoomShare url={room_url}/>
      </Grid>

      <Divider orientation="vertical" flexItem />

      <Grid item xs={5}>
      <TextIcon size="h4" icon={<LibraryBooksIcon fontSize="large"/>} text="Words"/>
      <div className="inputLine">
        <TextField
          id="standard-basic"
          size="small"
          label="Word"
          variant="outlined"
          value={wordInput}
          onKeyDown={onkeydownWord}
          onChange={handleWordChange}
          disabled={currentPlayer == null || wordSent >= 2}/>
        <Button
          id="outlined-basic-word"
          size="small"
          variant="contained"
          color="primary"
          onClick={sendWord}
          disabled={currentPlayer == null || wordSent >= 2}
          startIcon={<AddIcon/>}>
          Add word ({wordSent}/2)
        </Button>
      </div>
      {currentPlayer != null && words != null && words.map((word) => (<React.Fragment>
        <Chip
          icon={<LocalLibraryIcon/>}
          label={word}
          onDelete={handleWordDelete(word)}
          color="primary"
        />
        &nbsp;
        </React.Fragment>
      ))}
      </Grid>
    </Grid>
    </Paper>
    <Grid container>
      <Grid item xs/>
      <Grid item xs>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          size="large"
          onClick={gameIsReady}
          disabled={!isGameMaster}
          startIcon={<PlayCircleOutlineIcon fontSize="large"/>}>
          Start game
        </Button>
      </Grid>
      <Grid item xs/>
    </Grid>
  </React.Fragment>);
}

export default RoomScreen;
