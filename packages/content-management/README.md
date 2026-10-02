# content-management

azukiazusaのブログ用コンテンツ管理パッケージ。ブログ記事の管理、Contentful CMSとの同期、コンテンツ操作を行うCLIコマンドとAPIを提供します。

## 機能

- **コンテンツ作成**: 一意IDを持つ新しいブログ記事テンプレートの生成
- **コンテンツ同期**: ローカルのMarkdownファイルとContentful CMS間でのブログ記事同期
- **コンテンツ検証**: ブログ記事の構造とメタデータの検証
- **アナリティクス連携**: Google Analyticsから人気記事の取得
- **ファイル操作**: ブログ記事ファイルの作成、更新、管理

## コマンド

### `npm run new`
新しいブログ記事テンプレートを作成:
- 一意のnanoid識別子
- デフォルトのfrontmatter構造
- タイムスタンプメタデータ
- 空のコンテンツセクション

### `npm run sync`
ローカルファイルとContentful CMS間でコンテンツを同期。

### `npm run update`
既存のブログ記事コンテンツを更新。

### `npm run upload:media -- <記事 ID> [--dry-run]`
記事中のローカル画像・動画を Contentful へアップロードし、日本語・英語の記事の参照を URL に置き換えます。リポジトリルートからも実行できます。

```bash
npm run upload:media -- <記事 ID> --dry-run
npm run upload:media -- <記事 ID>
```

画像は記事と同じディレクトリに置く必要はありません。次の参照に対応しています。

- 記事ファイルからの相対パス: `![図](../../assets/image.png)`
- リポジトリルートからのパス: `![図](app/static/images/demo/image.png)`
- 静的ファイルの URL パス: `![図](/images/demo/image.png)` → `app/static/images/demo/image.png`
- ファイルシステムの絶対パス: `![図](/Users/name/Pictures/image.png)`
- `file:` URL: `![図](file:///Users/name/Pictures/image.png)`
- 空白を含むパス: `![図](<../../assets/my image.png>)`

相対パスは記事のディレクトリを優先し、次にリポジトリルートから解決します。絶対パスは実在するファイルを優先し、見つからなければ `app/static` に対する URL パスとして解決します。ファイル名だけの参照は、従来どおり日英のもう一方の記事ディレクトリも探します。

同じ実体を指す参照は 1 回だけアップロードし、異なるディレクトリの同名ファイルは別の画像として扱います。記事ディレクトリ直下の元ファイルは従来どおり処理後に削除します。それ以外の場所にある元ファイルは保持します。`--dry-run` ではアップロード・記事の書き換え・元ファイルの削除を行いません。

### `npm run validate`
定義されたスキーマに対してブログ記事の構造を検証。

### `npm run recap`
コンテンツの要約とサマリーを生成。

## API

以下のAPIを提供:
- **Contentful連携**: ブログ記事とタグのCRUD操作
- **Google Analytics**: 人気記事メトリクスの取得
- **ファイル操作**: frontmatter付きMarkdownファイルの読み書き
- **検索**: コンテンツの類似性に基づく関連記事の検索

## 型定義

主要なTypeScript型:
- `BlogPost`: 公開/下書き判別を持つメインブログ記事スキーマ
- `PublishedBlogPost`/`DraftBlogPost`: 型安全なバリアント
- `SelfAssessment`: インタラクティブコンテンツ用クイズ構造
- `Thumbnail`: 画像メタデータ
- `PopularPost`: アナリティクスデータ構造

## 依存関係

- **contentful-management**: CMS連携
- **@google-analytics/data**: Analytics API
- **yaml-front-matter**: frontmatterパース
- **zod**: ランタイム型検証
- **string-similarity**: コンテンツ類似性マッチング

## 開発

```bash
npm run test      # テスト実行
npm run lint      # コードリント
npm run typecheck # 型チェック
```