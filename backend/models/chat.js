const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function () {
        return (
          "CHAT_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5)
        );
      },
    },
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        avatar: {
          public_id: { type: String, required: true },
          url: { type: String, required: true },
        },
      },
    ],
    messages: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        content: [
          {
            senderId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            message: {
              type: String,
              default: "",
            },
            icon: {
              type: String,
            },
            images: [
              {
                public_id: String,
                url: String,
              },
            ],
            timestamp: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
