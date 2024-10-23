const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter product name"],
      trim: true,
      maxLength: [100, "Product name can not exceed 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "please enter product price"],
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Product price cannot be negative",
      },
    },
    description: {
      type: String,
      required: [true, "please enter product description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    options: [
      {
        name: {
          type: String,
        },
        values: [
          {
            type: String,
          },
        ],
      },
    ],
    variants: [
      {
        image: {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
        combination: [
          {
            type: String,
          },
        ],
        price: {
          type: Number,
        },
        stock: {
          type: Number,
        },
      },
    ],
    totalStock: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value >= 0;
        },
        message: "Product total stock cannot be negative",
      },
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    review: {
      rating: {
        type: Number,
        required: true,
        default: 0,
      },
      numberOfReviews: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    creatorId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "inactive",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
