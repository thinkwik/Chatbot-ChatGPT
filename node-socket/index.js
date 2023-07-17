const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const cors = require("cors");

app.use(cors());

const socket = require("socket.io");
const { Configuration, OpenAIApi } = require("openai");

server.listen(5000, () => {
  console.log(":: server listening on 5000 :::");
});

const configuration = new Configuration({
  apiKey: "OPEN_AI_KEY",
});
const openai = new OpenAIApi(configuration);

const io = new socket.Server(server, {
  path: "/api/socket.io",
  cookie: false,
  cors: { credentials: true, origin: true },
});

const chatHistory = [];
io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    console.log("===>> message from client:;", data.message);

    chatHistory.push({ role: "user", content: data.message });
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: chatHistory,
    });

    socket.emit("receiveMessage", {
      message: `${chatCompletion.data.choices[0].message.content}`,
    });
    chatHistory.push(chatCompletion.data.choices[0].message);
  });

  socket.on("disconnect", () => {
    console.log("===>>disconnect:;");
  });
});
