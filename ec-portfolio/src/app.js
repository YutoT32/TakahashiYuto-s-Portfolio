const path = require("path");
const express = require("express");
const apiRouter = require("./routes/api");
const webRouter = require("./routes/web");
const healthRouter = require("./routes/health");
const { errorHandler } = require("./middlewares/errorHandler");
const session = require("express-session");

const app = express();

// ミドルウェア設定
// ボディパーサー設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// セッション設定
app.use(
    session({
        secret: process.env.SESSION_SECRET || "change-me",
        resave: false,
        saveUninitialized: false,
    })
);

// ビューエンジン設定
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// ルーター設定
// ヘルスチェック
app.use("/health", healthRouter);
// Web
app.use("/", webRouter);
// API
app.use("/api", apiRouter);

// error handler (Last)
app.use(errorHandler);