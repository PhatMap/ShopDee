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
    type: {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
    variants: [
      {
        label: {
          type: String,
          required: true,
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
        inventory: [
          {
            choice: {
              type: String,
              required: true,
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
            stock: {
              type: Number,
              maxLength: [5, "Product stock cannot exceed 5 characters"],
              default: 0,
              validate: {
                validator: function (value) {
                  return value >= 0;
                },
                message: "Product stock cannot be negative",
              },
            },
          },
        ],
        totalVariants: {
          type: Number,
          default: 0,
          validate: {
            validator: function (value) {
              return value >= 0;
            },
            message: "Product total stock cannot be negative",
          },
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
