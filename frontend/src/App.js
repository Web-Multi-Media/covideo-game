import React, {useEffect} from 'react';
import './App.css';
import wildcardClient from '@wildcard-api/client';
import MainScreen from "./component/MainScreen";


function App() {

wildcardClient.serverUrl = 'http://localhost:8000'; // Default value is `null`

    useEffect(() => {
        console.log('use effect');
    }, []);


  return (

    <div className="App">
      <MainScreen/>
    </div>
  );
}

export default App;
