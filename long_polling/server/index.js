const express = require("express");
const cors = require("cors");
const events = require("events");
const app = express();

const emmiter = new events.EventEmitter();
const messages = [];

app.use(cors());
app.use(express.json());

app.get("/api/messages", (req, res) => {
  emmiter.once("newMessage", (data) => {
    res.json(messages);
  });
});
app.post("/api/messages", (req, res) => {
  const { message } = req.body;
  messages.unshift(message);

  emmiter.emit("newMessage", message);
  res.status(200).json({ message });
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
