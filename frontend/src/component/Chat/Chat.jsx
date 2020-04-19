import React, { useEffect, useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'


function Chat (props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (props.incomingChatMessage) {
      setMessages(messages.concat(props.incomingChatMessage));
    }
  }, [props.incomingChatMessage]);

  const submitMessage = function (messageString) {
    props.sendChatMessage(messageString);
  }

return (
    <div>
    {messages.map((message, index) =>
        <ChatMessage
          key={index}
          message={message.message}
          username={message.username}
        />,
    )}
    <ChatInput
        onSubmitMessage={submitMessage}
    />
    </div>
)
}

export default Chat
