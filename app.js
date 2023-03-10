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
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");

const Messenger = require("./models/messenger");

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
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

app.use(
  cors({
    // origin: ["http://localhost:3000", "http://localhost:3001"],
    origin: [
      "https://njs-301x-asm3-client.vercel.app",
      "https://njs-301x-asm3-admin.vercel.app",
    ],
    credentials: true,
  })
);
mongoose.set("strictQuery", true);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

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
  //Server nh???n key send_message v???i value data do ng?????i d??ng g???i l??n
  socket.on("send_message", (data) => {
    console.log("data-->", data);
    console.log(data.name + ": " + data.message);

    //Sau ???? n?? s??? update l???i database b??n ph??a ng?????i nh???n
    //V?? 1 b??n g???i 1 b??n nh???n n??n id_user ????i ng?????c nhau v?? category c??ng v???y
    const newData = {
      message: data.message,
      name: data.name,
      category: "receive",
    };

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

      //X??? l?? xong server g???i ng?????c l???i client th??ng qua socket v???i key receive_message
      socket.broadcast.emit("receive_message");
    } else {
      res.status(200).json("End Messenger!");
    }
  });

  // Server nh???n key send_order v???i value data do ng?????i d??ng g???i l??n
  // Ph???n n??y d??ng ????? x??? l?? b??n admin history bi???t ???????c c?? ng?????i v???a ?????t h??ng
  socket.on("send_order", (data) => {
    // console.log("data2 -->", data);

    //X??? l?? xong server g???i ng?????c l???i client admin th??ng qua socket v???i key receive_order
    socket.broadcast.emit("receive_order", data);
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/product", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/messenger", messengerRouter);

http.listen(process.env.PORT || 3500, () => {
  console.log("Server start successful!");
});
