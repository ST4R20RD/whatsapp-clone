import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router";
import "./App.css";
import Chat from "./components/Chat/Chat";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./components/Login/Login";
import { useStateValue } from "./StateProvider";
import { useEffect, useState } from "react";
import useWindowSize from "./hooks/useWindowSize";

function App() {
  const [{ user }] = useStateValue();
  const [isClosed, setIsClosed] = useState(false);
  const [isChatOnSide, setIsChatOnSide] = useState(true);
  const windowSize = useWindowSize();

  const closeSidebar = () => {
    if (windowSize.width <= 600) {
      setIsClosed(true);
    } else {
      setIsClosed(false);
    }
  };

  useEffect(() => {
    const showChat = () => {
      if (windowSize.width <= 585) {
        if (!isClosed) return false;
      }
      return true;
    };
    setIsChatOnSide(showChat());
  }, [windowSize, isClosed]);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <BrowserRouter>
            {!isClosed ? <Sidebar isClosed={isClosed} closeSidebar={closeSidebar} /> : null}
            <Routes>
              <Route path="/" />
              <Route
                path="/rooms/:roomId"
                element={isChatOnSide && <Chat isClosed={isClosed} setIsClosed={setIsClosed} />}
              />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
