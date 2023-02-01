const mongoose = require("mongoose");

const messegerSchema = new mongoose.Schema(
  {
    id_counselor: {
      type: String,
      required: true,
    },
    id_user: {
      type: String,
      required: true,
    },
    roomId: {
      type: String,
      required: true,
    },
    content: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Messenger = mongoose.model("messenger", messegerSchema);

module.exports = Messenger;
