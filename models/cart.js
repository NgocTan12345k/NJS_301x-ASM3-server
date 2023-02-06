const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  idUser: {
    type: String,
    required: true,
  },
  idProduct: {
    type: String,
    required: true,
  },
  nameProduct: {
    type: String,
    required: true,
  },
  priceProduct: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    reqquired: true,
  },
  img: {
    type: String,
    required: true,
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = Cart;
