const Product = require('./models/productModel');

const createProduct = async (productData) => {
    const newProduct = new Product(productData);
    return newProduct.save();
};

const getProductById = async (productId) => {
    const product = await Product.findById(productId).exec();
    return product;
};

const getAllProducts = async () => {
    const products = await Product.find().exec();
    return products;
};

const deleteProductById = async (productId) => {
    const deletedProduct = await Product.findByIdAndDelete(productId).exec();
    return deletedProduct;
};

const updateProductById = async (productId, updateParams) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        {_id: productId}, {$set: updateParams}, {new: true}).exec();
    return updatedProduct;
};

const getProductsByPriceRange = async (minPrice, maxPrice) => {
    const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
    })
    .sort({ price: -1 }) // Sort by price in descending order
    .exec();
    
    return products;
};

module.exports = {
    createProduct,
    getProductById,
    getAllProducts,
    deleteProductById,
    updateProductById,
    getProductsByPriceRange,
};
