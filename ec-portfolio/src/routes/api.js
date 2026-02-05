/*
api.js：APIルーティング設定
*/

const express = require("express");
const router = express.Router();
const { findAllProducts } = require("../repositories/productsRepo");

// 全商品取得APIエンドポイント
router.get("/products", async (req, res, next) => {
    try {
        const products = await findAllProducts();
        res.json({ products });
    } catch (err) {
        next(err);
    }
});

module.exports = router;