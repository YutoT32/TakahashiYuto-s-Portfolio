/*
web.js：画面ルーティング設定
*/

const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");
const cartController = require("../controllers/cartController");
const checkoutController = require("../controllers/checkoutController");

// ホームページは /products にリダイレクト
router.get("/", (req, res) => res.redirect("/products"));

// 商品一覧ページ表示
router.get("/products", productsController.showProducts);

// カートページ表示
router.get("/cart", cartController.showCart);

// チェックアウト処理
router.post("/checkout", cartController.checkout);

// カートに商品を追加
router.post("/cart/add", cartController.addToCart);

// カートから商品を削除
router.post("/cart/remove", cartController.removeFromCart);

// カートを空にする
router.post("/cart/clear", checkoutController.clearCart);

module.exports = router;