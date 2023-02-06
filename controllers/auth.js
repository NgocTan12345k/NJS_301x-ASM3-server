const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();

app.use(cookieParser());

// SIGN UP

const signup = async (req, res, next) => {
  const { userName, password, email } = req.body;

  const phone = parseInt(req.body.phone);

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

        const newUser = new User({
          userName: userName,
          password: encryptedPassword,
          email: email,
          phone: phone,
          role: "client",
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      });
    }
  } catch (error) {
    res.status(401).json(error);
  }
};

// MIDDLEWARE

const isAuth = (req, res, next) => {
  if (!req.sessionID) {
    res.status(401).json("You are not logged in!");
  } else {
    return next();
  }
};

// LOGIN

const login = async (req, res, next) => {
  const { email, password } = req.body;
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

    let decodedPassword = temp.password;

    bcrypt.compare(password, decodedPassword, function (err, resuilt) {
      if (resuilt === true) {
        req.session.user = temp;
        res.status(200).json({ message: "Login successful", user: temp });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    });
  } else {
    res.status(401).json({ message: "Wrong email" });
  }
};

const deleteSession = (req, res, next) => {
  try {
    req.session.destroy(function (err) {
      return res.status(200).json({ session: "cannot access session here!" });
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  isAuth,
  deleteSession,
};
