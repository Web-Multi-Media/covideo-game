import React, { useState } from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  text:{
    width: '70%',
    paddingRight: '10px'
  }
}));

function ChatInput(props) {
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    if(message !== ''){
      e.preventDefault();
      props.onSubmitMessage(message);
      setMessage('');
    }
  };

  const onkeydownWord = (event) => {
    if (event.keyCode === 13 && message !== '') {
      document.getElementById("outlined-basic-chat-input").click();
    }
  };

  return (
  <div className="inputLine">
    <TextField
        className={classes.text}
        id="standard-basic"
        size="small"
        label="Chat message"
        variant="outlined"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={onkeydownWord}
        onPaste={(e) => e.preventDefault()}
        inputProps={{maxLength: 100}}
        // disabled={disabledWordAdd}
        />
    <Button
        id="outlined-basic-chat-input"
        size="small"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        // disabled={disabledWordAdd}
        startIcon={<AddIcon/>}>
      Send
    </Button>
  </div>

  )
};

export default ChatInput;
