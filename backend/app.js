
require('express-async-errors');
require("dotenv").config();
const connectDB = require("./db/connect");
const express = require("express");
const cors = require('cors')
const http = require('http');
const { Server } = require("socket.io");
const mainRouter = require("./routes/user");
const User = require('./models/User')

const app = express();



app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use("/api/v1", mainRouter);

app.post('/api/v1/register', async (req, res) => {
  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser === null) {
    let { username, email, password } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
      });
      let newPerson = await person.save();
   
      io.emit("registration", newPerson)
      
      return res.status(201).json({ newPerson });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } else {
    return res.status(400).json({ msg: "Email already in use" });
  }
});


io.on("connection", (socket) => {
  console.log(socket.id);


  socket.emit("welcome", 'user');

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
 
  });
});


const PORT = 3000; 
server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
