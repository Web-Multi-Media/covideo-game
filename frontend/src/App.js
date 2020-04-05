import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
const io = require('socket.io-client');

function App() {

    useEffect(() => {
        console.log('use effect');
        console.log(inRoom)
    }, []);

    const [inRoom, setInRoom] = useState(false);


    return (
    <div className="App">
        {!inRoom && <ConnectionScreen/>}
        {inRoom && <MainScreen/>}
    </div>
  );
}

export default App;
