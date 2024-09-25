const Chat = require("../models/chat");
const User = require("../models/user");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

exports.getUserChats = catchAsyncErrors(async (req, res, next) => {
  const apiFeatures = new APIFeatures(
    Chat.find({
      participants: {
        $all: [{ $elemMatch: { userId: req.user._id } }],
      },
    }),
    req.query
  ).sort({ createdAt: -1, id: -1 });

  let chats = await apiFeatures.query;

  chats = apiFeatures.filterMyChats(chats).slice(0, 5);

  let otherParticipants = [];

  chats = chats.map((chat) => {
    const participants = chat.participants.filter(
      (participant) => participant.userId.toString() !== req.user._id.toString()
    );

    otherParticipants = otherParticipants.concat(participants);
  });

  chats = otherParticipants;

  res.status(200).json({ success: true, chats });
});

exports.getChats = catchAsyncErrors(async (req, res, next) => {
  const keyword = req.query.keyword;

  if (keyword === "") {
    return res.status(200).json({ success: true, chats: [] });
  }

  const apiFeatures = new APIFeatures(User.find(), req.query).search().sort();

  let chats = await apiFeatures.query;

  chats = apiFeatures.filterRole(chats, req.user.role);

  res.status(200).json({ success: true, chats });
});

exports.getChatDetails = catchAsyncErrors(async (req, res, next) => {
  const participantId = req.query.participantId;

  const apiFeatures = new APIFeatures(
    Chat.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: req.user._id } },
          { $elemMatch: { userId: participantId } },
        ],
      },
    }),
    req.query
  );

  let chat = await apiFeatures.query;

  if (!chat) {
    const user = await User.findById(participantId);

    chat = await Chat.create({
      participants: [
        {
          userId: req.user._id,
          name: req.user.name,
          avatar: {
            public_id: req.user.avatar.public_id,
            url: req.user.avatar.url,
          },
        },
        {
          userId: user._id,
          name: user.name,
          avatar: {
            public_id: user.avatar.public_id,
            url: user.avatar.url,
          },
        },
      ],
    });
  } else {
    chat.messages = chat.messages.slice(-5);
  }
  res.status(200).json({ success: true, chat });
});

function getDatePart(date) {
  if (typeof date === "string") {
    return date.split("T")[0];
  }
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return null;
}

let io, userSockets;

exports.setIo = (_io, _userSockets) => {
  io = _io;
  userSockets = _userSockets;
};

exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { message, chatId, date, images } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  let push = false;
  for (const section of chat.messages) {
    if (getDatePart(section.date) === getDatePart(date)) {
      section.content.push({
        senderId: req.user._id,
        message,
        timestamp: date,
      });
      push = true;
      break;
    }
  }

  if (!push) {
    chat.messages.push({
      date,
      content: [
        {
          senderId: req.user._id,
          message,
          timestamp: date,
        },
      ],
    });
  }

  chat.save();

  const latestMessages = [...chat.messages].slice(-5);

  res.status(200).json({
    success: true,
    chat: { ...chat.toObject(), messages: latestMessages },
  });

  const otherParticipant = chat.participants.filter(
    (participant) => participant.userId.toString() !== req.user._id.toString()
  );

  if (io && userSockets.has(otherParticipant[0].userId.toString())) {
    const socketId = userSockets.get(otherParticipant[0].userId.toString());
    io.to(socketId).emit("newMessage", {
      chat: { ...chat.toObject(), messages: latestMessages },
    });
  }
});
