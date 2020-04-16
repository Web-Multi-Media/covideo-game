import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles({
  button: {
    marginLeft: 2
  }
});

function PlayerAdd(props) {
  const classes = useStyles();
  const [textInput, setTextInput] = useState('');

  const handleNameChange = (event) => {
    setTextInput(event.target.value);
  };

  const onkeydownName = (event) => {
    if (event.keyCode === 13) {
      document.getElementById("outlined-basic-name-input").click();
    }
  };

  return (<React.Fragment>
    <div className="inputLine">
        <TextField
          id="standard-basic"
          size="small"
          label="Username"
          variant="outlined"
          value={textInput}
          onKeyDown={onkeydownName}
          onChange={handleNameChange}/>
        <Button
          id="outlined-basic-name-input"
          className={classes.button}
          size="small"
          variant="contained"
          color="primary"
          onClick={props.onSendUsername.bind(this, textInput)}
          startIcon={<PersonAddIcon/>}>Join</Button>
    </div>
  </React.Fragment>
  )
}

export default PlayerAdd;
