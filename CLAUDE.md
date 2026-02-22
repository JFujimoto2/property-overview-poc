# CLAUDE.md — 物件概要書自動生成システム

## プロジェクト概要

土地・一棟収益不動産の物件概要書を自動生成するRails Webアプリケーション。
詳細は `docs/機能概要.md` と `docs/開発計画.md` を参照。

## 技術スタック

- Ruby on Rails 8.1 / Ruby 4.0
- PostgreSQL 16 + PostGIS
- Hotwire (Turbo + Stimulus)
- Tailwind CSS
- RSpec (バックエンドテスト)
- Playwright (E2E/フロントエンドテスト)
- Solid Queue (バックグラウンドジョブ、Rails 8標準)
- Solid Cable (ActionCable、Rails 8標準)

## 開発ルール

### TDD (テスト駆動開発)

1. **Red**: まず失敗するテストを書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを整理する

- 新機能・バグ修正は必ずテストから書き始めること
- テストなしのコードをコミットしない
- テストファイルの配置:
  - モデル: `spec/models/`
  - コントローラ: `spec/requests/`（request specを使用）
  - サービス: `spec/services/`
  - ジョブ: `spec/jobs/`
  - システム: `spec/system/`（Playwright）
  - E2E: `e2e/`（Playwright）

### テスト

- **バックエンド**: RSpec
  - `bundle exec rspec` で全テスト実行
  - `bundle exec rspec spec/path/to/file_spec.rb` で個別実行
- **フロントエンド/E2E**: Playwright
  - `npx playwright test` で全テスト実行
  - `npx playwright test e2e/path/to/test.spec.ts` で個別実行
- テストではファクトリ（FactoryBot）を使用する
- 外部API呼び出しはWebMockでスタブする

### セキュリティ

- **APIキー・シークレットは必ず `.env` ファイルに記載する**
- `.env` は `.gitignore` に含め、絶対にコミットしない
- `.env.example` にキー名のみ記載してリポジトリに含める
- 環境変数の参照は `ENV.fetch("KEY_NAME")` を使用する（`ENV["KEY_NAME"]` は使わない）
- 個人情報を含むテストデータはファクトリでダミーデータを生成する

### コミット・プッシュ

- **コミット前に必ず全テストを実行し、すべてパスすることを確認する**
  ```bash
  bundle exec rspec && npx playwright test
  ```
- テストが1つでも失敗している状態ではコミット・プッシュしない
- コミットメッセージは日本語OK、プレフィックスを付ける:
  - `feat:` 新機能
  - `fix:` バグ修正
  - `test:` テスト追加・修正
  - `docs:` ドキュメント
  - `refactor:` リファクタリング
  - `chore:` 設定・依存関係等

### コーディング規約

- RuboCopに従う（`bundle exec rubocop`）
- サービスオブジェクトパターンを使用（`app/services/`）
- ビジネスロジックはモデルまたはサービスに置く（コントローラを薄く保つ）
- N+1クエリに注意（Bulletgemで検出）
- マジックナンバーは定数化する

### ブランチ戦略

- `main`: 本番相当。直接pushしない
- `feature/xxx`: 機能開発ブランチ
- `fix/xxx`: バグ修正ブランチ
- PRを作成してmainにマージする

## 主要ディレクトリ

```
docs/           設計ドキュメント
app/services/   ビジネスロジック（PDF解析、API連携等）
app/jobs/       バックグラウンドジョブ（Solid Queue）
spec/           RSpecテスト
e2e/            Playwrightテスト
```

## 外部サービス（.envに設定）

```
# .env.example
DATABASE_URL=
HEARTRAILS_API_URL=https://express.heartrails.com/api/json
GSI_GEOCODING_URL=https://msearch.gsi.go.jp/address-search/AddressSearch
```
