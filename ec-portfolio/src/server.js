const express = require("express");
const apiRouter = require("./routes/api");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// ポート設定（指定がなければ3000）
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ヘルスチェックエンドポイント
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// API
app.use("/api", apiRouter);

// error handler (Last)
app.use(errorHandler);

// ポート${PORT}でサーバー起動
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});