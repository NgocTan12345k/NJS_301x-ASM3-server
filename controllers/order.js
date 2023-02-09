const Order = require("../models/order");
const nodemailer = require("nodemailer");
const senGridTransport = require("nodemailer-sendgrid-transport");
const Cart = require("../models/cart");
const dotenv = require("dotenv");

dotenv.config();

const postOrder = async (req, res, next) => {
  const {
    idUser,
    userName,
    email,
    phone,
    address,
    idProduct,
    total,
    status,
    delivery,
  } = req.body;

  const cartsUser = await Cart.find({ idUser: idUser });

  try {
    // CREATE ORDER

    const newOrder = new Order({
      idUser: idUser,
      userName: userName,
      email: email,
      phone: phone,
      address: address,
      idProduct: idProduct,
      total: total,
      status: status,
      delivery: delivery,
    });

    const savedOrder = await newOrder.save();

    // SEND MAIL

    const transporter = nodemailer.createTransport(
      senGridTransport({
        auth: {
          api_key: process.env.API_KEY_SENGRID,
        },
      })
    );

    const htmlHead =
      '<table style="width:50%">' +
      '<tr style="border: 1px solid black;"><th style="border: 1px solid black;">Tên Sản Phẩm</th><th style="border: 1px solid black;">Hình Ảnh</th><th style="border: 1px solid black;">Giá</th><th style="border: 1px solid black;">Số Lượng</th><th style="border: 1px solid black;">Thành Tiền</th>';

    let htmlContent = "";

    for (let i = 0; i < cartsUser.length; i++) {
      htmlContent +=
        "<tr>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        cartsUser[i].nameProduct +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;"><img src="' +
        cartsUser[i].img +
        '" width="80" height="80"></td>' +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        parseInt(cartsUser[i].priceProduct).toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }) +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        cartsUser[i].count +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        (
          parseInt(cartsUser[i].priceProduct) * parseInt(cartsUser[i].count)
        ).toLocaleString("it-IT", { style: "currency", currency: "VND" }) +
        "</td><tr>";
    }

    const htmlResult =
      "<h1>Xin Chào " +
      userName +
      "</h1>" +
      "<h3>Phone: " +
      phone +
      "</h3>" +
      "<h3>Address:" +
      address +
      "</h3>" +
      htmlHead +
      htmlContent +
      "<h1>Tổng Thanh Toán: " +
      total.toLocaleString("it-IT", { style: "currency", currency: "VND" }) +
      "</br>" +
      "<p>Cảm ơn bạn!</p>";

    await transporter.sendMail({
      from: "tanbnfx15317@funix.edu.vn",
      to: email,
      subject: "Order succeeded!",
      html: htmlResult,
    });
    res.status(200).json(savedOrder);
  } catch (error) {
    console.log(error);
  }
};

const getOrder = async (req, res, next) => {
  const idUser = req.query.idUser;

  try {
    const orders = await Order.find({ idUser: idUser });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetail = async (req, res, next) => {
  const idOrder = req.params.id;

  const orderDetail = await Order.findById(idOrder);
  try {
    res.status(200).json(orderDetail);
  } catch (error) {
    console.log(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orderList = await Order.find();
    res.status(200).json(orderList);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { postOrder, getOrder, getOrderDetail, getAllOrders };
