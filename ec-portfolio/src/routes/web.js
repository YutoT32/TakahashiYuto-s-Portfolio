const express = require("express");
const router = express.Router();
const { findAllProducts } = require("../repositories/productsRepo");

// ホームページは /products にリダイレクト
router.get("/", (req, res) => res.redirect("/products"));

// 商品一覧ページ表示
router.get("/products", async (req, res, next) => {
    try {
        const products = await findAllProducts();
        res.render("products", { products });
    } catch (err) {
        next(err);
    }
});

module.exports = router;