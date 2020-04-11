import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import './SelectRoomScreen.css'

function SelectRoomScreen(props) {

    const [roomId, setRoomId] = useState('');

    const createNewRoom = () => {
        props.createNewRoom();
    };

    return (
        <React.Fragment>
            <p>Welcome to time's Up server</p>
            <div className="inputLine">
                <Button  id="outlined-basic-name" className="margButt" variant="contained" color="primary" onClick={createNewRoom}>
                    Create new room
                </Button>
            </div>
            <p>
                Share the room id: {roomId}
            </p>
        </React.Fragment>
    );
}

export default SelectRoomScreen;
