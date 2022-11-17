import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { Chat, DonutLarge, MoreVert, SearchOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import SidebarChat from "../SidebarChat/SidebarChat";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase";
import { useStateValue } from "../../StateProvider";

function Sidebar() {
  const [{ user }] = useStateValue();

  const [rooms, setRooms] = useState([]);

  async function getRooms() {
    const roomsCol = collection(db, "rooms");
    const roomsSnapshot = await getDocs(roomsCol);
    const roomsList = roomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    return setRooms(roomsList);
  }
  useEffect(() => {
    getRooms();
  }, [rooms]);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
