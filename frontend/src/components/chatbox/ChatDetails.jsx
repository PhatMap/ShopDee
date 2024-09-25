import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../../actions/chatActions";

const ChatDetails = () => {
  const { chat: chatDetails } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [receiver, setReceiver] = useState(null);
  const messageListRef = useRef(null);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [chat, setChat] = useState(null);

  const handlerSendMessage = useCallback(() => {
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
  }, [chat, message, images]);

  const onChange = useCallback(
    (e) => {
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
    },
    [images]
  );

  useEffect(() => {
    let isMounted = true;
    if (chatDetails && chatDetails._id) {
      if (messageListRef.current) {
        const { scrollHeight, clientHeight } = messageListRef.current;
        const isOverflow = scrollHeight > clientHeight;

        if (!isOverflow) {
          setChat(chatDetails);
        } else {
          const reversedChatDetails = {
            ...chatDetails,
            messages: [...chatDetails.messages].reverse(),
          };
          setChat(reversedChatDetails);
        }

        const Receiver = chatDetails.participants.filter(
          (p) => p.userId !== user._id
        );
        setReceiver(Receiver[0]);

        setTimeout(() => {
          if (isMounted) {
            messageListRef.current.scrollTop =
              messageListRef.current.scrollHeight;
          }
        }, 0);
      }
    } else {
      setChat(null);
    }
    return () => {
      isMounted = false;
    };
  }, [chatDetails]);

  useEffect(() => {
    console.log(chatDetails);
  }, [chatDetails]);

  return (
    <div className={`chatbox-details`} hidden={!chat || !chat._id}>
      <div className="chatbox-details-cotnainer">
        <div className="chatbox-details-header">
          <img src={receiver && receiver._id && receiver.avatar?.url} />
          <h5>{receiver && receiver._id && receiver.name}</h5>
        </div>
        <div ref={messageListRef} className={`chatbox-details-message-list `}>
          {chat &&
            chat._id &&
            chat.messages.length > 0 &&
            chat.messages.map((section, index) => (
              <div key={index} className={`chatbox-details-message-date`}>
                <h6>{section.date.split("T")[0]}</h6>
                {section.content.map((attribute, index) => (
                  <div
                    key={index}
                    className={`chatbox-details-message ${
                      attribute.senderId === user._id ? "sender" : "receiver"
                    }`}
                  >
                    <p>{attribute.message}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
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
                message.trim() === "" ? () => setIsInputFocused(false) : null
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
  );
};

export default ChatDetails;
