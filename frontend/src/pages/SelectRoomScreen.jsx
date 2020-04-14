import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import Rooms from "../component/Room/Rooms";
import './SelectRoomScreen.css';
import './Common.css';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

function SelectRoomScreen(props) {
  const [roomId, setRoomId] = useState('');
  const classes = useStyles();
  const rooms = props.rooms;

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
    <Rooms rooms={rooms} joinRoom={joinRoom}/>
    <div className="inputLine">
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={createNewRoom}
      >
        Add room
      </Button>
    </div>
  </React.Fragment>);
}

export default SelectRoomScreen;
