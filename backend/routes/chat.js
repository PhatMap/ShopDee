const express = require("express");
const router = express.Router();

const {
  getUserChats,
  getChats,
  getChatDetails,
  sendMessage,
} = require("../controllers/chatController");

const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/chats/me").get(isAuthenticatedUser, getUserChats);

router.route("/chats").get(isAuthenticatedUser, getChats);

router
  .route("/chats/details")
  .get(isAuthenticatedUser, getChatDetails)
  .post(isAuthenticatedUser, sendMessage);

module.exports = router;
