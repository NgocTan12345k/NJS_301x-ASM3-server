const Order = require("../models/order");
const nodemailer = require("nodemailer");
// const senGridTransport = require("nodemailer-sendgrid-transport");
const Cart = require("../models/cart");

// const transporter = nodemailer.createTransport(
//   {
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
//     auth: {
//       user: "kiemtienonlinee1@gmail.com",
//       pass: "12345678asd",
//       // api_key:
//       //   // "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",
//       //   "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",
//     },
//     authMethod: "PLAIN",
//     // tls: {
//     //   rejectUnauthorized: false,
//     // },
//   }
//   // senGridTransport({
//   //   host: "smtp.gmail.com",
//   //   port: 587,
//   //   secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
//   //   auth: {
//   //     user: "kiemtienonlinee1@gmail.com",
//   //     pass: "12345678asd",
//   //     api_key:
//   //       "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",
//   //   },
//   // })
// );

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
  //   console.log("idProduct-->", idProduct);

  const cartsUser = await Cart.find({ idUser: idUser });
  // console.log("cartUser-->", cartsUser);
  //   console.log("status-->", status);
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
    // console.log("newOrder-->", newOrder);
    const savedOrder = await newOrder.save();
    // console.log("savedOrder-->", savedOrder);

    // SEND MAIL

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
        cartsUser[i].priceProduct +
        "$</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        cartsUser[i].count +
        "</td>" +
        '<td style="border: 1px solid black; font-size: 1.2rem; text-align: center;">' +
        // parseInt(cartsUser[i].priceProduct) * parseInt(cartsUser[i].count) +
        total;
      ("$</td><tr>");
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
      total +
      "$</br>" +
      "<p>Cảm ơn bạn!</p>";
    // console.log("htlmResuilt-->", htmlResult);

    console.log("email-->", email);

    //  nodemailer
    //     .createTransport({
    //       service: "gmail",
    //       host: "smtp.gmail.com",
    //       port: 587,
    //       secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    //       auth: {
    //         user: "kiemtienonlinee1@gmail.com",
    //         pass: "12345678asd",
    //       },
    //       authMethod: "PLAIN",
    //     })
    //     .sendMail({
    //       from: "kiemtienonlinee1@gmail.com",
    //       to: email,
    //       subject: "Order succeeded!",
    //       html: htmlResult,
    //     });

    // await transporter.sendMail({
    //   from: "kiemtienonlinee1@gmail.com",
    //   to: email,
    //   subject: "Order succeeded!",
    //   html: htmlResult,
    // });
    res.status(200).json(savedOrder);
    return nodemailer
      .createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // nếu các bạn dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
        auth: {
          user: "kiemtienonlinee1@gmail.com",
          pass: "12345678asd",
        },
        authMethod: "PLAIN",
      })
      .sendMail({
        from: "kiemtienonlinee1@gmail.com",
        to: email,
        subject: "Order succeeded!",
        html: htmlResult,
      });
  } catch (error) {
    console.log(error);
  }
};

const getOrder = async (req, res, next) => {
  const idUser = req.query.idUser;
  // console.log("idUser-->", idUser);
  try {
    const orders = await Order.find({ idUser: idUser });
    // console.log("orders-->", orders);
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetail = async (req, res, next) => {
  const idOrder = req.params.id;
  console.log("idOrder-->", idOrder);

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
