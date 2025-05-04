const productService = require('../services/productService');
const {validate, validateUpdate} = require('./validators/productValidator');

// Using async/await
const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        if (products) {
            res.status(200).json({
                'status': 'success',
                'products': products,
            });
        } else {
            const e = new Error('Product not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        console.error(`Error in getAllProducts: ${error.message}`); // Log the error
        const e = new Error('Cannot get all products');
        return next(e);
    }
};

const getProductById = async (req, res, next) => {
    const id = req.params.productId;
    try {
        const product = await productService.getProductById(id);
        if (product) {
            res.status(200).json({
                'status': 'success',
                'product': product,
            });
        } else {
            const e = new Error('Product not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        console.error(`Error in getProductById: ${error.message}`); // Log the error
        const e = new Error('Cannot get product');
        return next(e);
    }
};

const deleteProductById = async (req, res, next) => {
    const id = req.params.productId;
    try {
        const deletedProduct = await productService.deleteProductById(id);
        if (deletedProduct) {
            res.status(200).json({
                'status': 'success',
                'product': deletedProduct,
            });
        } else {
            const e = new Error('Product not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        console.error(`Error in deleteProductById: ${error.message}`); // Log the error
        const e = new Error('Cannot delete product');
        return next(e);
    }
};

const updateProductById = async (req, res, next) => {
    const id = req.params.productId;
    const updateParams = req.body;
    try {
        await validateUpdate(updateParams);
    } catch (err) {
        console.error(`Validation error in updateProductById: ${err.message}`); // Log the error
        const e = new Error('Invalid product data');
        e.status = 400;
        return next(e);
    }

    try {
        const updatedProduct = await productService.updateProductById(id, updateParams);
        if (updatedProduct) {
            res.status(200).json({
                'status': 'success',
                'product': updatedProduct,
            });
        } else {
            const e = new Error('Product not found');
            e.status = 404;
            return next(e);
        }
    } catch (error) {
        console.error(`Error in updateProductById: ${error.message}`); // Log the error
        const e = new Error('Cannot update product');
        return next(e);
    }
};

// Using pure promises
const createProduct = (req, res, next) => {
    const productData = req.body;

    validate(productData).then((valid) => {
        productService.createProduct(productData).then((product) => {
            res.status(200).json({
                'message': 'Product created successfully',
                'product': product,
            });
        }).catch((error) => {
            console.error(`Error in createProduct: ${error.message}`); // Log the error
            const e = new Error('Product creation failed');
            e.status = 400;
            return next(e);
        });
    }).catch((error) => {
        console.error(`Validation error in createProduct: ${error.message}`); // Log the error
        const e = new Error('Invalid product data');
        e.status = 400;
        return next(e);
    });
};

const getProductsByPriceRange = async (req, res, next) => {
    try {
        const { min, max } = req.query;
        
        // Validate parameters
        const minPrice = min ? parseFloat(min) : 0;
        const maxPrice = max ? parseFloat(max) : Number.MAX_SAFE_INTEGER;
        
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            const e = new Error('Invalid price range parameters');
            e.status = 400;
            return next(e);
        }
        
        const products = await productService.getProductsByPriceRange(minPrice, maxPrice);
        
        res.status(200).json({
            'status': 'success',
            'products': products,
        });
    } catch (error) {
        console.error(`Error in getProductsByPriceRange: ${error.message}`);
        const e = new Error('Cannot get products by price range');
        return next(e);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    deleteProductById,
    updateProductById,
    createProduct,
    getProductsByPriceRange,
};
