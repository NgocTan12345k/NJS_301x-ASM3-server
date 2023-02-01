const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");

// Hàm tìm kiếm những sản phẩm mà user đã mua
// const getCartByUser = async (req, res, next) => {
//   const idUser = req.params.id;
//   try {
//     const carts = await Cart.find({ idUser: idUser });
//     res.status(200).json(carts);
//   } catch (error) {
//     console.log(error);
//   }
// };

// Hàm thêm sản phẩm vào giỏ hàng
const postAddToCart = async (req, res, next) => {
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  const count = req.query.count;

  const productDetail = await Product.findById(idProduct);

  // Hàm tìm kiếm sản phẩm đã có trong giỏ hàng chưa
  const carts = await Cart.findOne({ idUser: idUser, idProduct: idProduct });
  // console.log("carts-->", carts);

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
      // console.log("newCount-->", newCount);
      const cartId = carts._id.toString();
      // console.log("cartID-->", cartId);
      const updateCart = await Cart.findByIdAndUpdate(
        cartId,
        {
          count: newCount,
        },
        { new: true }
      );
      // console.log("updateCArt-->", updateCart);
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
    // console.log("cartList-->", cartList);
    const idUser = req.query.idUser;
    // console.log("idUser-->", idUser);
    const carts = cartList.filter((item) => {
      return item.idUser === idUser;
    });
    // console.log("cart-->", carts);
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
  const idUser = req.query.idUser;
  const idProduct = req.query.idProduct;
  const count = req.query.count;
  try {
    await Cart.updateOne(
      { idUser: idUser, idProduct: idProduct },
      { count: count },
      { new: true }
    );
    res.status(200).json("Product has been Updated");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  // getCartByUser,
  postAddToCart,
  getCart,
  deleteCart,
  updateCart,
};
