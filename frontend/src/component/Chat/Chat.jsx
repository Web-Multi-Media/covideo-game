import React, { useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        borderRadius: '10px'
    },
    chatMessages:{
    height: '77vh',
    overflowY: 'auto'
    }
}));


function Chat (props) {
  const [messages, setMessages] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (props.incomingChatMessage) {
      setMessages(messages.concat(props.incomingChatMessage));
    }

  }, [props.incomingChatMessage]);

  useEffect(() => {
     const container = document.getElementById("msgContainer");
        container.scrollTop = container.scrollHeight;
  }, [messages]);


  const submitMessage = function (messageString) {
      if(messageString !== '') {
          props.sendChatMessage(messageString);
      }
  }

return (
    <Paper className={classes.paper} elevation={3}>
        <div id="msgContainer" className={classes.chatMessages}>

    {messages.map((message, index) =>
        <ChatMessage
          key={index}
          message={message.message}
          username={message.username}
        />,
    )}
        </div>
        <div className="chatInput">
    <ChatInput
        onSubmitMessage={submitMessage}
    />
        </div>
    </Paper>
)
}

export default Chat
