const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
// const session = require("express-session");
// const MongoDBStore = require("connect-mongodb-session")(session);
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const Product = require("../models/product");

dotenv.config();

// app.use(cors());

// const store = new MongoDBStore({
//   uri: process.env.MONGO_URL,
//   collection: "session",
// });
// app.use(
//   session({
//     key: "userId",
//     secret: "secret-key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       expires: 60 * 60 * 24,
//     },
//     store: store,
//   })
// );
app.use(cookieParser());

const signup = async (req, res, next) => {
  const { userName, password, email } = req.body;

  const phone = parseInt(req.body.phone);

  // console.log("phone-->", phone);

  // console.log("userName-->", userName);

  const userList = await User.find();
  const userNameList = userList.map((item) => item.userName);
  const emailList = userList.map((item) => item.email);
  const phoneList = userList.map((item) => item.phone);

  try {
    if (userNameList.includes(userName) === true) {
      res.status(401).json({ message: "UserName already exists" });
    } else if (emailList.includes(email) === true) {
      res.status(401).json({ message: "Email already exists" });
    } else if (phoneList.includes(phone) === true) {
      res.status(401).json({ message: "Phone already exists" });
    } else {
      let encryptedPassword = "";
      bcrypt.hash(password, 12, async (err, hash) => {
        encryptedPassword = hash;
        // console.log("encryptedPassword-->", encryptedPassword);
        const newUser = new User({
          userName: userName,
          password: encryptedPassword,
          email: email,
          phone: phone,
          role: "client",
        });
        // console.log("newUser-->", newUser);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

const isAuth = (req, res, next) => {
  console.log("req.isLogin-->", req.session.isLogIn);
  if (!req.session.isLogIn) {
    res.status(401).json("You are not logged in!");
  } else {
    return next();
  }
};

const sessionLogin = async (req, res, next) => {
  // console.log("x--->", req.session.user);
  // console.log("req.sessionID-->", req.sessionID);
  // console.log("req.session.cookie-->", req.session.cookie);
  if (req.sessionID) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log("email-->", email);
  const user = await User.findOne({
    email: email,
  });
  if (user) {
    const temp = {
      userId: user._id,
      userName: user.userName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role,
    };
    // console.log("pass-->", password);
    let decodedPassword = temp.password;
    // console.log("decode-->", decodedPassword);

    bcrypt.compare(password, decodedPassword, function (err, resuilt) {
      // console.log("resuilt-->", resuilt);
      if (resuilt === true) {
        // res.setHeader("Set-Cookie", "logedIn= true; HttpOnly; max-Age=10");
        // console.log("req.session-->", req.session);
        req.session.user = temp;
        req.session.isLogIn = true;
        console.log("req.session.user-->", req.session.user);
        res.status(200).json({ message: "Login successful", user: temp });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    });
  } else {
    res.status(401).json({ message: "Wrong email" });
  }
};

module.exports = {
  signup,
  login,
  sessionLogin,
  isAuth,
};
