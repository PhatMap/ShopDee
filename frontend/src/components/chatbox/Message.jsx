import React, { useCallback, useRef, useState } from "react";

const Message = ({ section, user }) => {
  const iconList = [
    "https://static.xx.fbcdn.net/images/emoji.php/v9/t47/1/32/1f621.png",
    ,
    "https://static.xx.fbcdn.net/images/emoji.php/v9/t8e/1/32/1f606.png",
    ,
    "https://static.xx.fbcdn.net/images/emoji.php/v9/tc8/1/32/1f622.png",
    ,
    "https://static.xx.fbcdn.net/images/emoji.php/v9/t72/1/32/2764.png",
    ,
    "https://static.xx.fbcdn.net/images/emoji.php/v9/tb6/1/32/1f44d.png",
    ,
    "https://static.xx.fbcdn.net/images/emoji.php/v9/t7b/1/32/1f62e.png",
    ,
  ];

  const [showIconBox, setShowIconBox] = useState(null);
  const [showButtonIcon, setShowButtonIconx] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback((index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowIconBox(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setShowIconBox(null);
    }, 1000);
  }, []);
  return (
    <div className={`chatbox-details-message-date`}>
      <h6>{section.date.split("T")[0]}</h6>
      {section.content.map((attribute, index) => (
        <div
          className={`chatbox-message-container ${
            attribute.senderId === user._id ? "sender" : "receiver"
          }`}
        >
          <div
            hidden={attribute.message === "" ? true : false}
            key={index}
            className={`chatbox-details-message ${
              attribute.senderId === user._id ? "sender" : "receiver"
            }`}
            onMouseEnter={() => setShowButtonIconx(index)}
            onMouseLeave={() => setShowButtonIconx(null)}
          >
            <p>{attribute.message}</p>
            {showButtonIcon === index && (
              <button
                className={`message-icon-btns ${
                  attribute.senderId === user._id ? "sender" : "receiver"
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <i className="fa fa-thumbs-o-up icon-point">
                  {showIconBox === index && (
                    <span
                      className={`message-icon-show ${
                        attribute.senderId === user._id ? "sender" : "receiver"
                      }`}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => setShowIconBox(null)}
                    >
                      {iconList.map((icon) => (
                        <img width={25} height={25} src={icon} alt="icon" />
                      ))}
                    </span>
                  )}
                </i>
              </button>
            )}
          </div>
          <div
            hidden={attribute.images.length === 0 ? true : false}
            className={`chatbox-details-images`}
          >
            {attribute.images.length > 0 &&
              attribute.images.map((image, index) => (
                <img
                  width={50}
                  height={50}
                  key={index}
                  src={image.url}
                  alt="image"
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Message;
