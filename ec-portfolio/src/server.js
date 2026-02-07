/*
server.js：サーバー起動設定
*/

const app = require("./app");

// ポート設定（指定がなければ3000）
const PORT = process.env.PORT || 3000;

// ポート番号${PORT}でサーバー起動
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});