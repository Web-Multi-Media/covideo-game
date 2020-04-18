import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Rooms from "../component/Room/Rooms";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  button: {
    margin: 5
  }
});

function SelectRoomScreen(props) {
  const classes = useStyles();
  const rooms = props.rooms;
  const currentPlayer = props.currentPlayer;
  return (<React.Fragment>
    <Rooms
      currentPlayer={currentPlayer}
      rooms={rooms}
      joinRoom={props.joinRoom}/>
    <Fab
      variant="extended"
      color="primary"
      className={classes.button}
      onClick={props.createNewRoom}>
      <AddIcon />
      Create room
    </Fab>
  </React.Fragment>);
}

export default SelectRoomScreen;
