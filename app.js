const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const http = require("http").Server(app);
const socketio = require("socket.io");
const io = socketio(http);
const path = require("path");

const Messenger = require("./models/messenger");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
// const mailRouter = require("./routes/mail");
const messengerRouter = require("./routes/messenger");

dotenv.config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection susccessful!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
mongoose.set("strictQuery", true);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));

// session

const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "session",
});
app.use(
  session({
    key: "userId",
    secret: "Skull",
    resave: false,
    saveUninitialized: false,
    secure: false,
    store: store,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

// Run When client connects
io.on("connection", (socket) => {
  console.log(`New Web Socket Connection, socketID: ${socket.id}`);
  //Server nhận key send_message với value data do người dùng gửi lên
  socket.on("send_message", (data) => {
    console.log("data-->", data);
    console.log(data.name + ": " + data.message);

    //Sau đó nó sẽ update lại database bên phía người nhận
    //Vì 1 bên gửi 1 bên nhận nên id_user đôi ngược nhau và category cũng vậy
    const newData = {
      message: data.message,
      name: data.name,
      category: "receive",
    };
    // console.log("newData-->", newData);
    // console.log("newData.message-->", newData.message);

    if (newData.message.toLowerCase() !== "/end") {
      const postData = async () => {
        const messenger = await Messenger.findOne({
          id_counselor: data.id_user,
          id_user: data.id_counselor,
        });

        console.log("messenger-->", messenger);

        messenger.content.push(newData);

        messenger.save();
      };

      postData();

      //Xử lý xong server gửi ngược lại client thông qua socket với key receive_message
      socket.broadcast.emit("receive_message");
    } else {
      res.status(200).json("End Messenger!");
    }
  });

  // Server nhận key send_order với value data do người dùng gửi lên
  // Phần này dùng để xử lý bên admin history biết được có người vừa đặt hàng
  socket.on("send_order", (data) => {
    // console.log("data2 -->", data);

    //Xử lý xong server gửi ngược lại client admin thông qua socket với key receive_order
    socket.broadcast.emit("receive_order", data);
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/order", orderRouter);
// app.use("/api/mail", mailRouter);
app.use("/api/messenger", messengerRouter);

http.listen(process.env.PORT || 3500, () => {
  console.log("Server start successful!");
});
