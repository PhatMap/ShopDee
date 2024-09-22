import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  getChatDetails,
  getChats,
  getUserChats,
  sendMessage,
} from "../../actions/chatActions";
import { set } from "mongoose";

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
  const [chat, setChat] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handlerOpen = () => {
    if (!user) {
      history("/login");
    } else {
      setKeyword("");
      setChat(null);
      setIsOpen(!isOpen);
      dispatch(getUserChats());
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
    setChat(null);
    setKeyword("");
  };

  const handlerSendMessage = () => {
    const formData = new FormData();
    const currentDate = new Date();
    formData.set("date", currentDate.toISOString());
    formData.set("chatId", chat._id);
    formData.set("message", message);
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(sendMessage(formData));

    setMessage("");
    setImages([]);
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (keyword !== "") {
      dispatch(getChats({ keyword }));
    }
  }, [keyword]);

  useEffect(() => {
    if (chatDetails && chatDetails._id) {
      setChat(chatDetails);
      const Receiver = chatDetails.participants.filter(
        (p) => p.userId !== user._id
      );
      setReceiver(Receiver[0]);
    }
  }, [chatDetails]);

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
                  chat && chat._id ? "chart-container-open" : ""
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
                    myChats.map((user) => (
                      <div
                        key={user._id}
                        className={`chatbox-element ${
                          chatClicked === user._id
                            ? "chatbox-element-clicked"
                            : ""
                        }`}
                        onMouseDown={() => setChatClicked(user._id)}
                        onMouseUp={() => setChatClicked("")}
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
              <div className={`chatbox-details`} hidden={!chat || !chat._id}>
                <div className="chatbox-details-cotnainer">
                  <div className="chatbox-details-header">
                    <img
                      src={receiver && receiver._id && receiver.avatar?.url}
                    />
                    <h5>{receiver && receiver._id && receiver.name}</h5>
                  </div>
                  <div className="chatbox-details-message-list"></div>
                  <div className="chatbox-details-sendbox">
                    <div className="chatbox-details-sendbox-elements">
                      <label>
                        <i className="fa fa-file-image-o"></i>
                        <input
                          type="file"
                          name="images"
                          onChange={onChange}
                          multiple
                          hidden
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={
                          message.trim() === ""
                            ? () => setIsInputFocused(false)
                            : null
                        }
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                      />
                    </div>
                    <button
                      className={`${
                        isInputFocused
                          ? message.trim() === ""
                            ? "disabled"
                            : ""
                          : "disabled"
                      }`}
                      onClick={() => handlerSendMessage()}
                    >
                      <i className="fa fa-send"></i>
                    </button>
                  </div>
                </div>
              </div>
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
