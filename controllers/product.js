const Product = require("../models/product");

const getAllProducts = async (req, res, next) => {
  try {
    const productList = await Product.find();
    //   console.log("product-->", productList);
    res.status(200).json(productList);
  } catch (error) {
    console.log(error);
  }
};

const getProductDetail = async (req, res, next) => {
  try {
    const productId = req.params.id;
    // console.log("productId-->", productId);
    const productDetail = await Product.findById(productId);
    res.status(200).json(productDetail);
  } catch (error) {
    console.log(error);
  }
};

const postAddProduct = async (req, res, next) => {
  try {
    const { productName, category, price, short_desc, long_desc } = req.body;
    // console.log("productName-->", productName);
    // console.log("price-->", price);
    const images = req.files;
    // console.log("images-->", images);
    if (Array.isArray(images) && images.length > 0) {
      const imagesList = images.map((item) => {
        return item.path;
      });
      // console.log("imageList-->", imagesList);

      const [img1, img2, img3, img4] = imagesList;

      const x1 = img1.split("/").slice(1);
      const y1 = x1.unshift("http://localhost:3500");
      const z1 = x1.join("/");
      console.log("z1-->", z1);

      const x2 = img2.split("/").slice(1);
      const y2 = x2.unshift("http://localhost:3500");
      const z2 = x2.join("/");

      const x3 = img3.split("/").slice(1);
      const y3 = x3.unshift("http://localhost:3500");
      const z3 = x3.join("/");

      const x4 = img4.split("/").slice(1);
      const y4 = x4.unshift("http://localhost:3500");
      const z4 = x4.join("/");

      const newProduct = await Product({
        name: productName,
        category: category,
        price: price,
        short_desc: short_desc,
        long_desc: long_desc,
        img1: z1,
        img2: z2,
        img3: z3,
        img4: z4,
      });
      // console.log("newPro-->", newProduct);
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
  // console.log("productId-->", id);
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
    // console.log("req.body->", req.body);
    // console.log("updateProduct-->", updateProduct);
    res.status(200).json(updateProduct);
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
};
