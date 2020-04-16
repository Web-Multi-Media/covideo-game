import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import Rooms from "../component/Room/Rooms";
import TextIcon from "../component/TextIcon/TextIcon";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function SelectRoomScreen(props) {
  const [roomId, setRoomId] = useState('');
  const classes = useStyles();
  const rooms = props.rooms;
  const currentPlayer = props.currentPlayer;

  const createNewRoom = () => {
    props.createNewRoom();
  };

  const generateRandomRooms = () => {
    props.generateRandomRooms();
  }

  const joinRoom = (roomId) => {
    props.joinRoom(roomId);
  }

  const getRooms = () => {
    props.getRooms();
  }

  return (<React.Fragment>
    <Rooms
      currentPlayer={currentPlayer}
      rooms={rooms}
      joinRoom={joinRoom}/>
    <Button
      variant="contained"
      color="primary"
      className={classes.button}
      startIcon={<AddIcon />}
      onClick={createNewRoom}>
      Create room
    </Button>
  </React.Fragment>);
}

export default SelectRoomScreen;
