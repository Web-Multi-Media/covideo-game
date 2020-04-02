import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import wildcardClient, {endpoints} from '@wildcard-api/client';


function App() {

wildcardClient.serverUrl = 'http://localhost:8000'; // Default value is `null`
  // Browserc

  const [fecth, setFech] = React.useState('');
  const [counter, setCounter] = React.useState(0);

    async function fetchData() {
        const msg = await endpoints.myFirstEndpoint();
        setFech(msg.msg);
        setCounter(counter + 1);
    }

    useEffect(() => {
        console.log('use effect');
        fetchData();
    }, []);

    useEffect(() => {
        console.log('use effect 2');
    }, [counter]);

  return (

    <div className="App">
      <header className="App-header">
        <p>
            {fecth + counter}
        </p>
        <p onClick={fetchData}>
          Learn React

        </p>
      </header>
    </div>
  );
}

export default App;
