import React, { useState } from "react";
import "./App.css";
import { useRef } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");

  const [connected, setConnected] = useState(false);
  const socket = useRef();

  const [username, setUsername] = useState("");

  const addMessage = async () => {
    const newMessage = {
      id: new Date(),
      message: value,
      event: "send_message",
      username,
    };
    setValue("");

    socket.current.send(JSON.stringify(newMessage));
  };

  const login = async () => {
    socket.current = new WebSocket("ws://localhost:5001");

    socket.current.onmessage = (event) => {
      event = JSON.parse(event.data);
      console.log(event);

      switch (event.event) {
        case "connection":
          setMessages((prev) => [
            <p className="message" key={event.id}>
              {event.username} присоединился
            </p>,
            ...prev,
          ]);
          break;
        case "send_message":
          setMessages((prev) => [
            <p className="message" key={event.id}>
              {event.username}: {event.message}
            </p>,
            ...prev,
          ]);
          break;
        case "load_history":
          setMessages(
            event.messages.map((message) =>
              message.event === "connection" ? (
                <p className="message" key={message.id}>
                  {event.message} присоединился
                </p>
              ) : (
                <p className="message" key={message.id}>
                  {message.username}: {message.message}
                </p>
              )
            )
          );
          break;
        default:
          console.error("Unknown event", event);
          break;
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.current.onopen = () => {
      console.log("connected");
      setConnected(true);

      const message = {
        id: new Date(),
        username,
        event: "connection",
      };
      socket.current.send(JSON.stringify(message));
    };

    socket.current.onclose = () => {
      console.log("disconnected");
      setConnected(false);
    };
  };

  if (!connected) {
    return (
      <div className="App">
        <div className="center">
          <div className="form">
            <input
              type="text"
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={login}>Send</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="center">
        <div>
          <div className="form">
            <input
              type="text"
              placeholder="Введите сообщение"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={addMessage}>Send</button>
          </div>
          <div className="messages">{messages}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
