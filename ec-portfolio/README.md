# ec-portfolio - ECサイト参考実装

シンプルなEコマースサイトの実装。商品表示、カート機能、チェックアウト処理を実装した練習プロジェクトです。

## 技術スタック

- **Runtime**: Node.js (CommonJS)
- **フレームワーク**: Express.js 4.19.2
- **テンプレートエンジン**: EJS 4.0.1
- **データベース**: mysql2 3.16.1
- **その他**: express-session（セッション管理）

## セットアップと実行

### 前提条件
- Docker & Docker Compose がインストールされていること

### 起動手順

```bash
# コンテナの起動
docker compose up -d

# アプリケーションアクセス
# ブラウザで http://localhost:3001 を開く
```

### ローカル開発（コンテナなし）
```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動
npm run dev
```

## 使い方

### 1. 商品一覧ページ（`/products`）
- アプリのホームページ
- 登録されている全商品を一覧表示
- 各商品でカート追加ボタンをクリック

### 2. カートページ（`/cart`）
- セッションに保存されたカート内容を表示
- 各商品の小計と合計金額を表示
- 商品削除、数量変更が可能
- チェックアウトボタンで決済画面へ遷移

### 3. チェックアウトページ（`/checkout`）
- 注文ボタンで決済を実行
- 成功時：注文ID、合計金額、注文日時を表示
- 失敗時：エラーメッセージ（在庫不足など）を表示
- セッション内のカートは決済後にクリア

## API仕様

### GET `/api/products`
全商品情報をJSON形式で取得します。

**レスポンス例:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "商品名",
      "description": "商品説明",
      "price": 1000,
      "stock": 50,
      "image_url": "https://example.com/image.jpg",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## 画面構成

### products.ejs（商品一覧）
- 商品カード形式で表示
- 商品画像、名前、説明、価格、在庫数を表示
- 「カートに追加」フォームで数量入力可能（デフォルト1）

### cart.ejs（カート）
- テーブル形式でカート内容を表示
- 列：商品名、単価、数量、小計
- 合計金額を表示
- 削除、数量変更ボタン、チェックアウトボタン

### checkout.ejs（チェックアウト）
- 決済成功画面：注文ID、合計金額、作成日時
- 決済失敗画面：エラー内容と在庫不足情報

## 設計方針

### 1. レイヤーアーキテクチャ
```
Routes（ルーティング）
　↓
Controllers（ビジネスロジック）
　↓
Services（複雑な処理）
　↓
Repositories（データアクセス）
　↓
Database（MySQL）
```

**各レイヤーの役割:**
- **routes/**: HTTPリクエスト処理、ビュー/JSON出力
- **controllers/**: ビジネスロジック集約（現在は直接routesで実装）
- **services/**: 複雑な処理（チェックアウト、決済処理など）
- **repositories/**: データベースアクセス抽象化

### 2. カート管理
- **実装方法**: Express session を使用してサーバー側で管理
- **ストレージ**:  `req.session.cart` に `{ productId: quantity }` 形式で保存
- **利点**: クライアント側にデータを露出させない

### 3. トランザクション処理（チェックアウト）
```
BEGIN TRANSACTION
  ↓
1. 在庫確認（FOR UPDATE で行ロック）
  ↓
2. 在庫不足チェック → 不足時はエラー
  ↓
3. orders テーブルに注文を作成
  ↓
4. order_items テーブルに注文明細を登録
  ↓
5. products テーブルの在庫を更新
  ↓
COMMIT
```

**目的**: 複数ユーザーの同時決済時に在庫の二重計上を防止

### 4. エラーハンドリング
- **カスタムエラークラス**: `OutOfStockError` で在庫不足を区別
- **ビューでの表示**: エラー内容と詳細情報（不足商品など）をHTML出力
- **HTTPステータス**: 409（Conflict）で在庫不足を返す

### 5. データベース設計
```
products
├── id (PK)
├── name
├── description
├── price
├── stock
├── image_url
└── created_at

orders
├── id (PK)
├── total_price
└── created_at

order_items
├── order_id (FK → orders.id)
├── product_id (FK → products.id)
├── quantity
└── unit_price
```

**正規化**: 注文時に商品単価を order_items に記録（商品価格変更に対応）

## フォルダ構成

```
ec-portfolio
    ├─db                # データベース管理
    │  ├─init           # 初期化スクリプト
    │  ├─migrations     # （将来用）
    │  └─seeds          # （将来用）
    ├─public            # 静的ファイル
    │  └─css
    ├─src               # アプリ本体
    │  ├─config         # 各種設定（DB）
    │  ├─controllers    # 
    │  ├─middlewares    # ミドルウェア
    │  ├─repositories   # データアクセス
    │  ├─routes         # ルーティング（API、Web）
    │  └─services       # 複雑な処理
    └─views             # 表示

```

## よくある問題と解決方法

### 在庫が不足するエラー（409エラー）
- チェックアウト時に既に売り切れ商品がカートに入っていないか確認
- 複数ユーザーの同時決済の場合は、一度カート内容をリロード

### セッション情報が保持されない
- ブラウザの Cookie が有効か確認
- Docker環境では、コンテナの再起動でセッションが初期化される

## 今後の拡張案

- [ ] ユーザー認証機能（会員登録・ログイン）
- [ ] 商品検索・フィルター機能
- [ ] 商品レビュー/評価機能
- [ ] 複数配送先対応
- [ ] 決済ゲートウェイ統合（Stripe など）
- [ ] 在庫管理画面
- [ ] 注文履歴表示
- [ ] キャッシング（Redis）
