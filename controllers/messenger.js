const Messenger = require("../models/messenger");
const User = require("../models/user");

const getAllMesenger = async (req, res, next) => {
  try {
    const messenger = await Messenger.find();
    // console.log("messenger-->", messenger);

    res.status(200).json(messenger);
  } catch (error) {
    console.log(error);
  }
};

const getMessengerDetail = async (req, res, next) => {
  try {
    //Dùng để load ra những tin nhắn mà người dùng định chat
    //Dựa vào id của chính user và id người mà user muốn chat

    const id_counselor = req.query.id_counselor;
    const id_user = req.query.id_user;

    const messenger = await Messenger.findOne({
      id_counselor: id_counselor,
      id_user: id_user,
    });

    // const messenger = await Messenger.find();
    // console.log("messenger-->", messenger);

    res.status(200).json(messenger);
  } catch (error) {
    console.log(error);
  }
};

const send = async (req, res, next) => {
  try {
    //Khi mà user bấm gửi tin nhắn thì nó sẽ lấy query sau đó push vào cơ sở dữ liệu

    const id_counselor = req.query.id_counselor;
    const id_user = req.query.id_user;

    // console.log("id_counselor-->", id_counselor);
    // console.log("id_user-->", id_user);

    const data = {
      // roomId: req.query.roomId,
      message: req.query.message,
      name: req.query.name,
      category: req.query.category,
    };
    console.log("data-->", data);
    if (data.message.toLowerCase() !== "/end") {
      //Tìm đúng tới cuộc trò chuyện của user xong sau đó push vào
      const messenger = await Messenger.findOne({
        id_counselor: id_counselor,
        id_user: id_user,
      });

      // console.log("messenger-->", messenger);

      messenger.content.push(data);

      messenger.save();

      res.status(200).send("Send Messenger success!");
    }
  } catch (error) {
    console.log(error);
  }
};

// Hàm này là khi user đăng ký account thì nó sẽ tự động push vào messenger để tạo database cuộc trò chuyện

const conversation = async (req, res, next) => {
  try {
    // id_counselor
    const id_counselor = "63cebfeb9da5ee68f0215dfe";

    const email = req.query.email;
    const roomId = req.query.roomId;

    // console.log("email-->", email);
    // Tạo conversation khi user chưa đăng nhập

    if (email === "email_temp") {
      const id_user = "abc999";

      // Tạo ra 2 cuộc trò chuyện
      // 1 cái của admin
      const data1 = {
        id_counselor: id_counselor,
        id_user: id_user,
        roomId: roomId,
        content: [],
      };

      // console.log("data1-->", data1);

      // 1 cái của user
      const data2 = {
        id_counselor: id_user,
        id_user: id_counselor,
        roomId: roomId,
        content: [],
      };

      // console.log("data2-->", data2);

      Messenger.insertMany(data1);

      Messenger.insertMany(data2);

      res.status(200).send("Success!");
    } else {
      // Tạo conversation khi user đã đăng nhập

      // Tìm user để lấy id_user
      const user = await User.findOne({ email: email });

      // console.log("user-->", user);

      const id_user = user._id.toString();

      // console.log("id_user-->", id_user);

      // Tạo ra 2 cuộc trò chuyện
      // 1 cái của admin
      const data1 = {
        id_counselor: id_counselor,
        id_user: id_user,
        roomId: roomId,
        content: [],
      };

      // console.log("data1-->", data1);

      // 1 cái của user
      const data2 = {
        id_counselor: id_user,
        id_user: id_counselor,
        roomId: roomId,
        content: [],
      };

      // console.log("data2-->", data2);

      Messenger.insertMany(data1);

      Messenger.insertMany(data2);

      res.status(200).send("Success!");
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteMessenger = async (req, res, next) => {
  const roomId = req.params.roomId;
  // console.log("roomId-->", roomId);
  try {
    await Messenger.deleteMany({ roomId: roomId });
    res.status(200).json("Delete Messenger success!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllMesenger,
  getMessengerDetail,
  send,
  conversation,
  deleteMessenger,
};
