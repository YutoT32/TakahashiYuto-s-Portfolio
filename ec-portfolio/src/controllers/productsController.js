const { findAllProducts } = require("../repositories/productsRepo");

exports.showProducts = async (req, res, next) => {
    try {
        const products = await findAllProducts();
        res.render("products", { products });
    } catch (err) {
        next(err);
    }
};