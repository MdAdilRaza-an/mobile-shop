const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const slugify = require('slugify');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, brand, category_id, is_featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const productId = await Product.create({
      name,
      slug,
      description,
      price,
      stock: stock || 0,
      brand,
      image,
      category_id,
      is_featured: is_featured === 'true' || is_featured === true
    });

    const product = await Product.findById(productId);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    const filters = {};

    if (category) filters.category_id = category;
    if (search) filters.search = search;
    if (featured === 'true') filters.featured = true;

    const products = await Product.findAll(filters);
    const categories = await Category.findAll();

    res.json({
      success: true,
      products,
      categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, stock, brand, category_id, is_featured } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    const slug = name ? slugify(name, { lower: true, strict: true }) : product.slug;

    await Product.update(req.params.id, {
      name: name || product.name,
      slug,
      description: description || product.description,
      price: price || product.price,
      stock: stock !== undefined ? stock : product.stock,
      brand: brand || product.brand,
      image,
      category_id: category_id || product.category_id,
      is_featured: is_featured !== undefined ? (is_featured === 'true' || is_featured === true) : product.is_featured
    });

    const updatedProduct = await Product.findById(req.params.id);

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.delete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};