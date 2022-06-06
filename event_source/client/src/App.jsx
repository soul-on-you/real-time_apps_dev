import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("useeffect");
    subscribeToMessages();
  }, []);

  const subscribeToMessages = async () => {
    const eventSource = new EventSource(
      "http://localhost:5001/api/messages/connect"
    );
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages([...data]);
    };
  };

  const addMessage = async () => {
    const newMessage = { id: new Date(), message: value };
    setValue("");

    await axios.post("http://localhost:5001/api/messages", {
      message: newMessage,
    });
  };

  return (
    <div className="App">
      <div className="center">
        <div>
          <div className="form">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={addMessage}>Send</button>
          </div>
          <div className="messages">
            {messages.map((message) => (
              <div className="message" key={message.id}>
                {message.message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
