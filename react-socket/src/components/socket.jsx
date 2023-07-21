import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./socket.css";
import ImgChatbot from "../images/chatbot.svg";
const socket = io("http://localhost:5000", {
  path: "/api/socket.io",
});
export const SocketConnect = () => {
  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [loader, setLoader] = useState(false);

  socket.on("receiveMessage", (data) => {
    const newList = [...chatList, { role: "server", message: data.message }];
    setChatList(newList);
    setLoader(false);
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  }, [socket]);

  function handleSubmit() {
    socket.emit("sendMessage", { message });
    const newList = [...chatList, { role: "client", message: message }];
    setChatList(newList);
    setMessage("");
    setLoader(true);
  }

  function handleInputText(e) {
    const value = e.target.value;
    setMessage(value);
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="title">AI assistant</h2>
        </div>
        <div className="chat-body">
          {chatList.map((chat, index) => {
            return (
              <>
                <div className="message-item">
                  {chat.role != "client" ? (
                    <img src={ImgChatbot} className="img-chatbot" />
                  ) : (
                    ""
                  )}

                  <div
                    key={index}
                    className={
                      chat.role === "client"
                        ? "message  sender-message"
                        : "message receiver-message"
                    }
                  >
                    {loader && chatList.length === index ? (
                      <p className="typing-message">
                        <span></span>
                        <span></span>
                        <span></span>
                      </p>
                    ) : (
                      <p>{chat.message}</p>
                    )}
                  </div>
                </div>
                {/* <div className="message-item">
                  <img src={ImgChatbot} className="img-chatbot" />
                  <div className="message typing-message">
                    <p>
                      <span></span>
                      <span></span>
                      <span></span>
                    </p>
                  </div>
                </div> */}
              </>
            );
          })}
        </div>
        <div className="chat-footer">
          <input
            className="form-control"
            type="text"
            value={message}
            placeholder="Type your message"
            onChange={handleInputText}
          />
          <div>
            <button className="send-btn" onClick={handleSubmit}>
              {!loader ? "Send" : <div id="loader" className="loader"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
