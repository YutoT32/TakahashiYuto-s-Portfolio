const path = require("path");
const express = require("express");
const apiRouter = require("./routes/api");
const webRouter = require("./routes/web");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// ポート設定（指定がなければ3000）
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ビューエンジン設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// ヘルスチェック
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Web
app.use("/", webRouter);

// API
app.use("/api", apiRouter);

// error handler (Last)
app.use(errorHandler);

// ポート番号${PORT}でサーバー起動
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});