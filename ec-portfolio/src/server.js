const express = require("express");
const app = express();

// ポート設定（指定がなければ3000）
const PORT = process.env.PORT || 3000;

// ヘルスチェックエンドポイント
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// ポート${PORT}でサーバー起動
app.listen(PORT, () => {
    console.log('Server listening on port ${PORT}');
});