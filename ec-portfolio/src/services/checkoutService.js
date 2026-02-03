const pool = require("../config/db");

class OutOfStockError extends Error {
    constructor(message, details = []) {
        super(message);
        this.name = "OutOfStockError";
        this.details = details;
    }
}

async function checkout(cart) {
    const items = Object.entries(cart || {})
        .map(([productId, qty]) => ({
            productId: Number(productId),
            qty: Number(qty),
        }))
        .filter((x) => Number.isFinite(x.productId) && Number.isFinite(x.qty) && x.qty > 0);
    
    if (items.length === 0) {
        throw new Error("Cart is empty");
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        // 在庫確認
        const products = [];
        for (const it of items) {
            // 商品情報をロック付きで取得
            const [rows] = await conn.query(
                "SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE",
                [it.productId]
            );
            const p = rows[0];
            // 在庫不足チェック
            if (!p) {
                throw new Error(`Product not found: ${it.productId}`);
            }
            products.push(p);
        }

        // 在庫不足があればエラーを投げる
        const out = [];
        for (const it of items) {
            const p = products.find((x) => x.id === it.productId);
            if (p.stock < it.qty) {
                out.push({
                    productId: p.id,
                    name: p.name,
                    requested: it.qty,
                    stock: p.stock,
                })
            }
        }
        if (out.length > 0) {
            throw new OutOfStockError("Out of stock", out);
        }

        // 注文登録
        const totalPrice = items.reduce((sum, it) => {
            const p = products.find((x) => x.id === it.productId);
            return sum + p.price * it.qty;
        }, 0);

        // 注文テーブルに登録
        const [orderResult] = await conn.query(
            "INSERT INTO orders (total_price) VALUES (?)",
            [totalPrice]
        );
        const orderId = orderResult.insertId;

        // 注文明細登録と在庫更新
        for (const it of items) {
            const p = products.find((x) => x.id === it.productId);

            // 在庫更新
            await conn.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [it.qty, it.productId,]
            );

            // 注文明細登録
            await conn.query(
                "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
                [orderId, it.productId, it.qty, p.price]
            );
        }

        // コミット
        await conn.commit();

        // 結果を返す
        return {
            orderId,
            totalPrice,
            items: items.map((it) => {
                const p = products.find((x) => x.id === it.productId);
                return {
                    productId: p.id,
                    name: p.name,
                    qty: it.qty,
                    unitPrice: p.price,
                    lineTotal: p.price * it.qty,
                };
            }),
        };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = { checkout, OutOfStockError };