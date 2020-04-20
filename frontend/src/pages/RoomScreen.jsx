import React, {useState} from 'react';
import "./RoomScreen.css";
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
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
    margin: 20,
    textSize: "large"
  },
  paper: {
    padding: 20
  },
  backButton: {
    marginBottom: 10,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  }
}));

function RoomScreen(props) {
  const classes = useStyles();
  const [wordInput, setWordInput] = useState('');
  const room_url = `http://localhost:3000/${props.roomId}`;
  const currentPlayer = props.currentPlayer;
  const disabledWordAdd = currentPlayer.name === '' || props.playerWords.length >= props.roomSettings.numWordsPerPlayer;
  const disabledStartGame = props.isGameMaster === false || props.players.length < 2 || props.playerWords.length < props.roomSettings.numWordsPerPlayer;

  const sendWord = () => {
    if (wordInput !== '') {
      props.onSendWord(wordInput);
      setWordInput('');
    }
  };

  const handleWordChange = (event) => {
    setWordInput(event.target.value);
  };

  const handleWordDelete = name => event => {
    props.onDeleteWord(name);
  }

  const onkeydownWord = (event) => {
    if (event.keyCode === 13 && props.playerWords.length < props.roomSettings.numWordsPerPlayer) {
      document.getElementById("outlined-basic-word").click();
    }
  };

  return (<React.Fragment>

    {/* Leave room */}
    <Button
      className={classes.backButton}
      variant="contained"
      color="secondary"
      size="medium"
      onClick={props.leaveRoom.bind(this, currentPlayer.id)}
      startIcon={<ArrowBackIcon fontSize="large"/>}>
    Rooms
    </Button>

    {/* Room UI (settings, players, sharing) */}
    <Paper className={classes.paper}>
    <Grid container spacing={2}>

      {/* Room settings panel */}
      <Grid item xs={5}>
      <RoomSettings
        isGameMaster={props.isGameMaster}
        roomSettings={props.roomSettings}
        onChangeSettings={props.onChangeSettings}
      />
      </Grid>
      <Divider orientation="vertical" flexItem/>

      {/* Players table */}
      <Grid item xs={5}>
      <Players
        currentPlayer={currentPlayer}
        players={props.players}
        gameMaster={props.gameMaster}
        isGameMaster={props.isGameMaster}
        kickPlayer={props.kickPlayer}
        onSendUsername={props.onSendUsername}/>
      </Grid>
      <Divider flexItem />

      {/* Room sharing */}
      <Grid item xs={5}>
      <RoomShare url={room_url}/>
      </Grid>
      <Divider orientation="vertical" flexItem />

      {/* Words */}
      <Grid item xs={5}>
      <TextIcon size="h4" icon={<LibraryBooksIcon fontSize="large"/>} text="Words"/>
      <p>Add your own words to the guess list !</p>
      <div className="inputLine">
        <TextField
          id="standard-basic"
          size="small"
          label="Word"
          variant="outlined"
          className={classes.input}
          value={wordInput}
          onKeyDown={onkeydownWord}
          onChange={handleWordChange}
          disabled={disabledWordAdd}/>
        <Button
          id="outlined-basic-word"
          size="small"
          variant="contained"
          color="primary"
          onClick={sendWord}
          disabled={disabledWordAdd}
          startIcon={<AddIcon/>}>
          Add word ({props.playerWords.length}/{props.roomSettings.numWordsPerPlayer})
        </Button>
      </div>
      {currentPlayer.name !== '' && props.playerWords.map((word) => (<React.Fragment key={word}>
        <Chip
          label={word}
          onDelete={handleWordDelete(word)}
          color="primary"/>
        &nbsp;
        </React.Fragment>
      ))}
      </Grid>
    </Grid>
    </Paper>

    {/* Start game button */}
    <Grid container>
      <Grid item xs/>
      <Grid item xs>
        <Fab
          className={classes.button}
          variant="extended"
          color="primary"
          size="large"
          onClick={props.onGameReady}
          disabled={disabledStartGame}>
          <PlayCircleFilledIcon/>&nbsp;
          Start game
        </Fab>
      </Grid>
      <Grid item xs/>
    </Grid>
  </React.Fragment>);
}

export default RoomScreen;
