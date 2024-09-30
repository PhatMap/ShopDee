import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  getChatDetails,
  getChats,
  getUserChats,
} from "../../actions/chatActions";
import { GET_CHAT_DETAIL_RESET } from "../../constants/chatConstants";
import ChatDetails from "./ChatDetails";

const Chatbox = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats: myChats } = useSelector((state) => state.myChats);
  const { chats: foundChats } = useSelector((state) => state.chats);
  const { chat: chatDetails } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const history = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [chatClicked, setChatClicked] = useState("");

  const handlerOpen = () => {
    if (!user) {
      history("/login");
    } else {
      setKeyword("");
      setIsOpen(!isOpen);
      dispatch(getUserChats());
      dispatch({ type: GET_CHAT_DETAIL_RESET });
    }
  };

  const handlerSearch = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  };

  const handlerOpenChatDetails = (participantId) => {
    dispatch(getChatDetails({ participantId }));
  };

  const handlerCloseChat = () => {
    setIsOpen(false);
    setKeyword("");
  };

  useEffect(() => {
    if (keyword !== "") {
      dispatch(getChats({ keyword }));
    }
  }, [keyword]);

  return (
    <Fragment>
      <div className="chatbox-default">
        {isOpen && (
          <div>
            <div className="chatbox-header">
              <img src={user.avatar?.url} />
              <h5>{user.name}</h5>
              <button onClick={() => handlerCloseChat()}>
                <i className="fa fa-times" />
              </button>
            </div>
            <div className={`chatbox-overlay `}>
              <div
                className={`chatbox-container ${
                  chatDetails && chatDetails._id ? "chart-container-open" : ""
                }`}
              >
                <input
                  type="search"
                  placeholder="Tìm theo người dùng..."
                  onChange={(e) => handlerSearch(e)}
                />
                <nav className="separator-1" />
                <div className="chatbox-list">
                  {keyword === "" ? (
                    myChats &&
                    myChats.length > 0 &&
                    myChats.map((user) => (
                      <div
                        key={user.userId}
                        className={`chatbox-element ${
                          chatClicked === user.userId
                            ? "chatbox-element-clicked"
                            : ""
                        }`}
                        onMouseDown={() => setChatClicked(user.userId)}
                        onMouseUp={() => setChatClicked("")}
                        onClick={() => handlerOpenChatDetails(user.userId)}
                      >
                        <img src={user.avatar?.url} />
                        <div className="chatbox-content">
                          <h6>{user.name}</h6>
                          <p>{user.name}</p>
                        </div>
                      </div>
                    ))
                  ) : foundChats && foundChats.length > 0 ? (
                    foundChats.map((user) => (
                      <div
                        key={user._id}
                        className={`chatbox-element ${
                          chatClicked === user._id
                            ? "chatbox-element-clicked"
                            : ""
                        }`}
                        onMouseDown={() => setChatClicked(user._id)}
                        onMouseUp={() => setChatClicked("")}
                        onClick={() => handlerOpenChatDetails(user._id)}
                      >
                        <img src={user.avatar?.url} />
                        <div className="chatbox-content">
                          <h6>{user.name}</h6>
                          <p>{user.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="chatbox-element">
                      <div className="chatbox-content">
                        <h6>Không có kết quả</h6>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ChatDetails />
            </div>
          </div>
        )}
        <button
          onMouseDown={() => setIsClicked(true)}
          onMouseUp={() => setIsClicked(false)}
          onClick={() => handlerOpen()}
          type="button"
          className={`chatbox-btn ${isClicked ? "style-blue-1" : ""}`}
        >
          <img src="https://salt.tikicdn.com/ts/ta/e1/5e/b4/2e33d86e11e2841a6a571de6084ff365.png" />
          <p>Tin nhắn</p>
        </button>
      </div>
    </Fragment>
  );
};

export default Chatbox;
