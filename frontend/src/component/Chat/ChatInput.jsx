import React, { useState } from 'react';


function ChatInput(props) {
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    props.onSubmitMessage(message)
    setMessage('')
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder={'Enter message...'}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <input type="submit" value="send"/>
    </form>
  )
};

export default ChatInput;
