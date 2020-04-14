import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

function PlayerAdd(props) {
  const [displayName, setdisplayName] = useState(false);
  const [textInput, setTextInput] = useState('');
  const currentPlayer = props.currentPlayer;

  const sendName = () => {
    if (textInput !== '') {
      props.onSend(textInput);
      setTextInput('');
      setdisplayName(true);
    }
  };

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  const onkeydownName = (event) => {
    if (event.keyCode === 13 && !displayName) {
      document.getElementById("outlined-basic-name-input").click();
    }
  };

  return (<React.Fragment>
    <div className="inputLine">
      {!displayName && <React.Fragment>
        <TextField
          id="standard-basic"
          size="small"
          label="Username"
          variant="outlined"
          value={textInput}
          onKeyDown={onkeydownName}
          onChange={handleNameChange}
          disabled={displayName}/>
        <Button
          id="outlined-basic-name-input"
          size="small"
          variant="contained"
          color="primary"
          onClick={props.onSendUsername.bind(this, textInput)}
          disabled={displayName}
          startIcon={<PersonAddIcon/>}>Join</Button>
        </React.Fragment>
      }
    </div>
  </React.Fragment>
  )
}

export default PlayerAdd;
