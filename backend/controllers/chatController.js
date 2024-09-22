const Chat = require("../models/chat");
const User = require("../models/user");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// exports.uploadChatImages = catchAsyncErrors(async (req, res, next) => {
//   let images = Array.isArray(req.body.images)
//     ? req.body.images
//     : [req.body.images];
//   let imagesLinks = [];

//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: "chat_images",
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }
//   console.log("imagesLinks", imagesLinks);
//   res.status(201).json({
//     success: true,
//     images: imagesLinks,
//   });
// });

exports.getUserChats = catchAsyncErrors(async (req, res, next) => {
  const chats = await Chat.find({ participants: req.user._id })
    .sort({ createdAt: -1, _id: -1 })
    .limit(5);

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
  }

  res.status(200).json({ success: true, chat });
});

exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { message, chatId, date, images } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  let push = false;
  const inputDate = new Date(date);
  const sendDate = inputDate.toDateString();

  for (const section of chat.messages) {
    if (new Date(section.date).toDateString() === sendDate) {
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

  res.status(200).json({ success: true });
});
