const express = require("express");
const cors = require("cors");
const events = require("events");
const app = express();

const emmiter = new events.EventEmitter();
const messages = [];

app.use(cors());
app.use(express.json());

app.get("/api/messages/connect", (req, res) => {
  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
  });

  emmiter.on("newMessage", (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
});

app.post("/api/messages", (req, res) => {
  const { message } = req.body;
  messages.unshift(message);

  emmiter.emit("newMessage", messages); 
  res.status(200).json({ message });
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
