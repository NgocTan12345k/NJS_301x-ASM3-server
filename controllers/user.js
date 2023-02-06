const User = require("../models/user");
const Messenger = require("../models/messenger");

const getAllUser = async (req, res, next) => {
  const userList = await User.find();
  try {
    res.status(200).json(userList);
  } catch (error) {
    console.log(error);
  }
};

const getId_userByRoomId = async (req, res, next) => {
  try {
    const id_counselor = "63cebfeb9da5ee68f0215dfe";
    const roomId = req.params.roomId;

    const messenger = await Messenger.find({ roomId: roomId });

    const id_user = messenger
      .map((item) => {
        return item.id_user;
      })
      .filter((value) => {
        return value !== id_counselor;
      })
      .toString();

    res.status(200).json(id_user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getAllUser, getId_userByRoomId };
