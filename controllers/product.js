const Product = require("../models/product");

const getAllProducts = async (req, res, next) => {
  try {
    const productList = await Product.find();
    res.status(200).json(productList);
  } catch (error) {
    console.log(error);
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productDetail = await Product.findById(productId);
    res.status(200).json(productDetail);
  } catch (error) {
    console.log(error);
  }
};

const postAddProduct = async (req, res, next) => {
  try {
    const { productName, category, price, short_desc, long_desc, quantity } =
      req.body;
    const images = req.files;
    if (Array.isArray(images) && images.length > 0) {
      const imagesList = images.map((item) => {
        return item.path;
      });

      const [img1, img2, img3, img4] = imagesList;

      const x1 = img1.split("/").slice(1);
      const y1 = x1.unshift("https://ecommerce-app-server.onrender.com");
      const z1 = x1.join("/");

      const x2 = img2.split("/").slice(1);
      const y2 = x2.unshift("https://ecommerce-app-server.onrender.com");
      const z2 = x2.join("/");

      const x3 = img3.split("/").slice(1);
      const y3 = x3.unshift("https://ecommerce-app-server.onrender.com");
      const z3 = x3.join("/");

      const x4 = img4.split("/").slice(1);
      const y4 = x4.unshift("https://ecommerce-app-server.onrender.com");
      const z4 = x4.join("/");

      const newProduct = await Product({
        name: productName,
        category: category,
        price: price,
        short_desc: short_desc,
        long_desc: long_desc,
        quantity: quantity,
        img1: z1,
        img2: z2,
        img3: z3,
        img4: z4,
      });
      const savedProduct = newProduct.save();
      res.status(200).json(savedProduct);
    } else {
      throw new Error("Images upload unsuccessful!");
    }
  } catch (error) {
    console.log(error);
  }
};

const deteleProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json("Delete Product successful!");
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async (req, res, next) => {
  const id = req.params.id;

  try {
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
  }
};

const updateProductQuantity = async (req, res, next) => {
  const idProductList = req.body.idProductList;
  const countList = req.body.countList;

  try {
    for (let i = 0; i < idProductList.length; i++) {
      await Product.findByIdAndUpdate(
        { _id: idProductList[i] },
        { $inc: { quantity: -countList[i] }, multi: true },
        { new: true }
      );
    }
    res.status(200).json("Update Product quantity successful!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  getProductDetail,
  postAddProduct,
  deteleProduct,
  updateProduct,
  updateProductQuantity,
};
