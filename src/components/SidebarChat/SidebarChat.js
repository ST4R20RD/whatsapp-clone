import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import db from "../../firebase";
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";

function SidebarChat({ id, name, addNewChat, closeSidebar }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (id) {
      const roomsRef = collection(db, "rooms", id, "messages");
      const q = query(roomsRef, orderBy("timestamp", "desc"));
      onSnapshot(q, (querySnapshot) => {
        setMessages(querySnapshot.docs.map((doc) => doc.data()));
      });
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter chat name");
    if (roomName) {
      await addDoc(collection(db, "rooms"), {
        name: roomName,
      });
    }
  };

  function padTo2Digits(num) {
    return String(num).padStart(2, "0");
  }

  const now = new Date();
  const lastSeen = () => {
    const timestamp = new Date(messages[0]?.timestamp?.toDate());
    if (now.getDate() !== timestamp.getDate()) {
      return timestamp.getDay() + "/" + timestamp.getMonth() + "/" + timestamp.getFullYear();
    } else {
      return padTo2Digits(timestamp.getHours()) + ":" + padTo2Digits(timestamp.getMinutes());
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`} onClick={closeSidebar}>
      <div className="sidebarChat">
        <div className="sidebarChat__container">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className="sidebarChat__info">
            <h2>{name}</h2>
            <p>
              {(messages[0]?.userId !== user.uid ? messages[0]?.username + ": " : "") +
                messages[0]?.message}
            </p>
          </div>
        </div>
        <div className="sidebarChat__lastSeen">{lastSeen()}</div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
