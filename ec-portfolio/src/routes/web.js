const express = require("express");
const router = express.Router();
const { findAllProducts, findProductById } = require("../repositories/productsRepo");

function getCart(req) {
    if (!req.session.cart) req.session.cart = {};
    return req.session.cart;
}

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

// カートページ表示
router.get("/cart", async (req, res, next) => {
    try {
        const cart = getCart(req);
        const items = [];
        let total = 0;
        
        // カート内の商品をループ
        for (const [productId, qty] of Object.entries(cart)) {
            // 商品情報を取得
            const product = await findProductById(Number(productId));
            // もし商品が存在しなければスキップ
            if (!product) continue;
            // 小計から合計金額を計算
            const lineTotal = product.price * qty;
            total += lineTotal;
            // アイテム情報を配列itemsに追加
            items.push({ product, qty, lineTotal });
        }

        res.render("cart", { items, total });
    } catch (err) {
        next(err);
    }
});

// カートに商品を追加
router.post("/cart/add", async (req, res, next) => {
    try {
        const productId = Number(req.body.productId);
        const qty = Math.max(1, Number(req.body.qty || 1));

        const product = await findProductById(productId);
        if (!product) return res.status(404).send("Product not found");

        const cart = getCart(req);
        cart[productId] = (cart[productId] || 0) + qty;

        res.redirect("/cart");
    } catch (err) {
        next(err);
    }
});

// カートから商品を削除
router.post("/cart/remove", (req, res) =>{
    const productId = String(req.body.productId);
    const cart = getCart(req);
    delete cart[productId];
    res.redirect("/cart");
});

// カートを空にする
router.post("/cart/clear", (req, res) => {
    req.session.cart = {};
    res.redirect("/cart");
});

module.exports = router;