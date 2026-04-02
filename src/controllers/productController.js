import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// 🔍 SEARCH + FILTER + PAGINATION
export const getAllProducts = async (req, res) => {
  try {
    let query = {};

    // 🔍 Search by name
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // 🎯 Filter by category (optional)
    if (req.query.category) {
      query.category = req.query.category;
    }

    // 💰 Filter by price (optional)
    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }

    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const products = await Product.find(query).limit(limit).skip(skip);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ⭐ DELETE REVIEW + UPDATE RATING
export const deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.query.productId);

    // ❌ Product not found
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Keep only other users' reviews
    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() !== req.user._id.toString(),
    );

    const numOfReviews = reviews.length;

    // ⭐ Recalculate rating safely
    const ratings =
      numOfReviews === 0
        ? 0
        : reviews.reduce((acc, item) => acc + item.rating, 0) / numOfReviews;

    product.reviews = reviews;
    product.numOfReviews = numOfReviews;
    product.ratings = ratings;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
