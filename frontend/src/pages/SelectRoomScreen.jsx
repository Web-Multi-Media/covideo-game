import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import Rooms from "../component/Room/Rooms";
import './SelectRoomScreen.css';
import './Common.css';

function SelectRoomScreen(props) {
  const [roomId, setRoomId] = useState('');
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
      <Button id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={createNewRoom}>
        New room
      </Button>
    </div>
  </React.Fragment>);
}

export default SelectRoomScreen;
