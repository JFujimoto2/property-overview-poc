# CLAUDE.md — 物件概要書自動生成システム

## プロジェクト概要

土地・一棟収益不動産の物件概要書を自動生成するRails Webアプリケーション。
詳細は `docs/features/機能概要.md` と `docs/plans/開発計画.md` を参照。

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

#### 全般
- RuboCopに従う（`bundle exec rubocop`）
- マジックナンバー・マジックストリングは使わない。定数またはenumで定義する
- メソッドは1つの責務に絞る（単一責任原則）
- ネストは最大3段階まで。深くなる場合はメソッド抽出やearly returnで整理する
- コメントは「なぜ（Why）」を書く。「何を（What）」はコード自体で表現する

#### Rails
- サービスオブジェクトパターンを使用（`app/services/`）
- ビジネスロジックはモデルまたはサービスに置く（コントローラを薄く保つ）
- コントローラのアクションは7つの標準アクション（index/show/new/create/edit/update/destroy）に限定する。収まらない場合は別コントローラに分割する
- N+1クエリに注意する。関連データは `includes` / `preload` で事前読み込みする
- スコープはモデルに定義する。コントローラで直接 `where` チェーンを書かない
- `ENV.fetch("KEY_NAME")` を使う（`ENV["KEY_NAME"]` は使わない）

#### 命名規則
- モデル: 単数形・PascalCase（`Property`, `LandRegistration`）
- テーブル: 複数形・snake_case（`properties`, `land_registrations`）
- サービス: 動詞+名詞・PascalCase（`RegistrationPdfParser`, `StationFinder`）
- メソッド: 動詞始まり・snake_case（`fetch_zone_info`, `parse_registration`）
- boolean: `is_`を付けない。疑問形（`vacant?`, `completed?`）

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

## 開発進捗

| フェーズ | 内容 | 状態 |
|---------|------|------|
| 0 | プロジェクト初期セットアップ | 完了 |
| 1 | 物件CRUD・認証・ダッシュボード (F01, F09) | 未着手 |
| 2 | 登記簿PDFパーサー (F02) | 未着手 |
| 3 | 地番→位置変換・地域情報取得 (F03, F04) | 未着手 |
| 4 | レントロール手動入力 (F05) | 未着手 |
| 5 | 添付資料・修繕履歴 (F06, F07) | 未着手 |
| 6 | 概要書プレビュー・PDF出力 (F08) | 未着手 |

詳細は `docs/plans/開発計画.md` を参照。

## 外部サービス（.envに設定）

```
# .env.example
DATABASE_URL=
HEARTRAILS_API_URL=https://express.heartrails.com/api/json
GSI_GEOCODING_URL=https://msearch.gsi.go.jp/address-search/AddressSearch
```
