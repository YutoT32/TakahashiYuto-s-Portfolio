const express = require("express");
const rooter = express.Router();

// ヘルスチェック
rooter.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

module.exports = rooter;