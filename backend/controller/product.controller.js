import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //finf all products

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    //if not in redis from mongodb
    //,lean() is gonna return a plain js object good for document
    featuredProducts = await Product.find({ isFeautured: true }).lean();
    if (!featuredProducts) {
      res.status(404).json({ message: "Server Error", error: error.message });
    }
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      image:
        "https://media.istockphoto.com/id/163208487/photo/male-coat-isolated-on-the-white.jpg?s=612x612&w=0&k=20&c=3Sdq5xnVS2jOYPNXI6JLwAumzyelcP_VgKVW0MVUhwo=",
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct controller", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      cloudinaryResponse: cloudinaryResponse || "No image uploaded",
    });
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("error deleting from cloudinary", error.message);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("error in deleting product controller ", error.message);
  }
};
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeautured = !product.isFeautured;
      const updatedProduct = await product.save();

      await updateFeaturedProductCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeautured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
