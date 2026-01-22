const pool = require("../config/db");

async function findAllProducts(){
    const [rows] = await pool.query(
        "SELECT id, name, description, price, stock, image_url, created_at FROM products ORDER BY id"
    );
    return rows;
}

module.exports = { findAllProducts };