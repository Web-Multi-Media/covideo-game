import React, {useEffect, useState} from 'react';
import './App.css';
import MainScreen from "./component/MainScreen";
import ConnectionScreen from "./component/ConnectionScreen";
const URL = 'ws://localhost:8000'

function App() {

    let ws = new WebSocket(URL)

    useEffect(() => {
        console.log('use effect');
        console.log(inRoom)
        ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected prout')
        }
    }, []);

   useEffect(() => {
       ws.onmessage = (message) => {
           const obj = JSON.parse(message.data);
           switch(obj.type) {
               case 'added user':
                   // code block
                   console.log('user added');
                   console.log(obj.value);
                   break;
               default:
                   // code block
                   console.log('type inconnu');
                   break;
           }
       }
   });

    const sendMessage =  (name) => {
        console.log('sending message');
        ws.send(JSON.stringify({type: 'add user', value: name}));
    };

    const [inRoom, setInRoom] = useState(false);


    return (
    <div className="App">
        {!inRoom &&
        <ConnectionScreen
            // webSocket = {ws}
            onSend = {sendMessage}
        />}
        {inRoom && <MainScreen/>}
    </div>
  );
}

export default App;
