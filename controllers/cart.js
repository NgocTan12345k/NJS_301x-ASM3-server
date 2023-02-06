const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

// Hàm thêm sản phẩm vào giỏ hàng
const postAddToCart = async (req, res, next) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  const count = req.query.count;

  const productDetail = await Product.findById(idProduct);

  // Hàm tìm kiếm sản phẩm đã có trong giỏ hàng chưa
  const carts = await Cart.findOne({ idUser: idUser, idProduct: idProduct });

  try {
    if (!carts) {
      const insertToCart = new Cart({
        idUser: idUser,
        idProduct: idProduct,
        nameProduct: productDetail.name,
        priceProduct: productDetail.price,
        count: count,
        img: productDetail.img1,
      });
      const savedCart = await insertToCart.save();
      res.status(200).json(savedCart);
    } else {
      const newCount = parseInt(carts.count) + parseInt(count);

      const cartId = carts._id.toString();

      const updateCart = await Cart.findByIdAndUpdate(
        cartId,
        {
          count: newCount,
        },
        { new: true }
      );

      res.status(200).json(updateCart);
    }
  } catch (error) {
    console.log(error);
  }
};

// Hàm lấy sản phẩm ra từ giỏ hàng

const getCart = async (req, res, next) => {
  try {
    const cartList = await Cart.find();

    const idUser = req.query.idUser;

    const carts = cartList.filter((item) => {
      return item.idUser === idUser;
    });

    res.status(200).json(carts);
  } catch (error) {
    console.log(error);
  }
};

// Hàm xóa sản phẩm

const deleteCart = async (req, res, next) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  try {
    await Cart.deleteOne({
      idUser: idUser,
      idProduct: idProduct,
    });
    res.status(200).json("Product has been deleted");
  } catch (error) {
    console.log(error);
  }
};

// Hàm sửa sản phẩm

const updateCart = async (req, res, next) => {
  const idCartList = req.body.idCartList;
  const countList = req.body.countList;
  try {
    for (let i = 0; i < idCartList.length; i++) {
      await Cart.findByIdAndUpdate(
        { _id: idCartList[i] },
        { $inc: { count: countList[i] }, multi: true },
        { new: true }
      );
    }
    res.status(200).json("Update Cart count successful!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  postAddToCart,
  getCart,
  deleteCart,
  updateCart,
};
