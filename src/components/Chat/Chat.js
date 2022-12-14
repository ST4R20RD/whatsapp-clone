import React, { useEffect, useState } from "react";
import "./Chat.css";
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
  ArrowBackIos,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import {
  query,
  collection,
  doc,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";

const sameUserAsLastMsg = (messages, message, index) => {
  return messages[index - 1].username === message.username;
};

function Chat({ isClosed, setIsClosed }) {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (roomId) {
      onSnapshot(doc(db, "rooms", roomId), (snapshot) => {
        setRoomName(snapshot.data().name);
      });
      const roomsRef = collection(db, "rooms", roomId, "messages");
      const q = query(roomsRef, orderBy("timestamp", "asc"));
      onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    const roomsRef = collection(db, "rooms", roomId, "messages");
    await addDoc(roomsRef, {
      userId: user.uid,
      username: user.displayName,
      message: input,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  function padTo2Digits(num) {
    return String(num).padStart(2, "0");
  }

  const date = (message) => {
    const timestamp = new Date(message.timestamp?.toDate());
    return padTo2Digits(timestamp.getHours()) + ":" + padTo2Digits(timestamp.getMinutes());
  };

  useEffect(() => {
    const chat = document.getElementById("chat");
    if (isClosed) {
      chat.style.flex = "1";
    }
  }, [isClosed]);

  return (
    <div id="chat" className="chat">
      <div className="chat__header">
        {isClosed ? (
          <button className="chat__backBtn" onClick={() => setIsClosed(false)}>
            <ArrowBackIos />
          </button>
        ) : null}
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>Tap for group info</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message, index) => {
          return (
            <p
              key={index}
              className={`chat__message ${message.userId === user.uid && "chat__receiver"} ${
                index > 0 && sameUserAsLastMsg(messages, message, index) && "chat__sameUser"
              }`}
            >
              <span className="chat__messageContent">
                {index > 0 ? (
                  !sameUserAsLastMsg(messages, message, index) && (
                    <span className="chat__name">{message.username}</span>
                  )
                ) : (
                  <span className="chat__name">{message.username}</span>
                )}
                {message.message}
              </span>
              <span className="chat__timestamp">{date(message)}</span>
            </p>
          );
        })}
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage} type="submit">
            Send Message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}
export default Chat;
