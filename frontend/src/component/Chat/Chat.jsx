import React, { useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme,test) => ({
    paper: {
        width: '100%',
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        borderRadius: '10px'
    },
    chatMessages:{
        height: test,
        overflowY: 'auto',
        wordBreak: 'break-all'
    }
}));


function Chat (props) {
  const [messages, setMessages] = useState([]);
  const [set, setSet] = useState(0);
  const classes = useStyles();
    const {height} = props;
  useEffect(() => {
    if (props.incomingChatMessage) {
      setMessages(messages.concat(props.incomingChatMessage));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.incomingChatMessage]);

  useEffect(() => {
      if (set !== props.set) {
          setMessages([]);
          setSet(props.set);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.set]);

  useEffect(() => {
     const container = document.getElementById("msgContainer");
        container.scrollTop = container.scrollHeight;
  }, [messages]);


  const submitMessage = function (messageString) {
      if (messageString !== '') {
          props.sendChatMessage(messageString);
      }
  }

return (
    <Paper className={classes.paper} elevation={3}>
        <div id="msgContainer" className={classes.chatMessages} style={{height}}>

    {messages.map((message, index) =>
        <ChatMessage
          key={index}
          message={message.message}
          username={message.username}
        />,
    )}
        </div>

        {props.sendInput && <div className="chatInput">
            <ChatInput
                onSubmitMessage={submitMessage}
            />
        </div>}
    </Paper>
)
}

export default Chat
