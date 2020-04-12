import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import './SelectRoomScreen.css';
import './Common.css';
import Rooms from "./Rooms";

function SelectRoomScreen(props) {
  const [roomId, setRoomId] = useState('');

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

  const rooms = props.rooms;

  return (<React.Fragment>
    <h1>Welcome to Time's Up server</h1>
    <Rooms rooms={rooms} joinRoom={joinRoom}/>
    <div className="inputLine">
      <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={getRooms}>
        Refresh rooms
      </Button>
      <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={createNewRoom}>
        Create new room
      </Button>
    </div>
    <p>
      Share the room id: {roomId}
    </p>
  </React.Fragment>);
}

export default SelectRoomScreen;
