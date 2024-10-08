import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../../actions/notificationActions";
import { NEW_MESSAGE } from "../../constants/chatConstants";

const SocketManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && user) {
      socket.connect();

      socket.emit("login", user._id);

      socket.on("newNotification", () => {
        dispatch(getNotifications());
      });

      socket.on("newMessage", (data) => {
        dispatch({
          type: NEW_MESSAGE,
          payload: { chat: data.chat },
        });
        console.log(data.chat);
      });

      return () => {
        socket.off("newMessage");
        socket.off("newNotification");
        socket.disconnect();
      };
    }
  }, [socket, user]);

  return null;
};

export default SocketManager;
