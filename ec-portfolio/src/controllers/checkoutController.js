const { checkout, OutOfStockError } = require("../services/checkoutService");

exports.checkout = async (req, res, next) => {
    try {
        const cart = req.session.cart || {};
        const result = await checkout(cart);

        req.session.cart = {};

        res.render("checkout", {ok: true, result });
    } catch (err) {
        if (err instanceof OutOfStockError) {
            return res.status(409).render("checkout", {
                ok: false,
                error: "在庫が足りない商品があります",
                details: err.details,
            });
        }
        if (String(err.message || "").includes("Cart is empty")) {
            return res.status(400).render("checkout", {
                ok: false,
                error: "カートが空です",
                details: [],
            });
        }
        next(err);
    }
};