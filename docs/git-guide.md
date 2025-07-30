# Git運用・バージョン管理ガイドライン

## 🔄 開発フロー

### ブランチ戦略（GitHub Flow）

```
main（本番）
├── feature/recipe-list      # レシピ一覧機能
├── feature/recipe-create    # レシピ作成機能
├── feature/search           # 検索機能
└── fix/validation-bug       # バグ修正
```

### 基本的な開発フロー
```bash
# 1. 新機能の開始
git checkout main
git pull origin main
git checkout -b feature/recipe-create

# 2. 実装・コミット
git add .
git commit -m "feat: レシピ作成フォームのUIを追加"

# 3. 定期的にpush
git push origin feature/recipe-create

# 4. 完成後、mainにマージ
git checkout main
git merge feature/recipe-create
git push origin main
```

## 📝 コミットメッセージ規約

### プレフィックス
- `feat:` 新機能追加
- `fix:` バグ修正
- `docs:` ドキュメント更新
- `style:` コードスタイル修正（動作に影響なし）
- `refactor:` リファクタリング
- `test:` テスト追加・修正
- `chore:` その他（依存関係更新など）

### 良いコミットメッセージ例
```
✅ feat: レシピ作成フォームにバリデーション機能を追加
✅ fix: レシピ削除時の確認ダイアログが表示されない問題を修正
✅ docs: READMEにセットアップ手順を追加
✅ refactor: RecipeServiceの型定義を改善

❌ git add .
❌ 修正
❌ update
❌ いろいろ直した
```

## 🏷️ バージョニング

### セマンティックバージョニング（v1.0.0）
- **メジャー（1.x.x）**: 破壊的変更
- **マイナー（x.1.x）**: 新機能追加（後方互換性あり）
- **パッチ（x.x.1）**: バグ修正

### MVP段階のバージョン管理
```
v0.1.0 - プロジェクト基盤完成
v0.2.0 - レシピCRUD機能完成
v0.3.0 - 検索機能完成
v1.0.0 - MVP完成（初回リリース）
```

## 📦 リリース管理

### リリースノート（CHANGELOG.md）
```markdown
# Changelog

## [v0.2.0] - 2025-07-31

### Added
- レシピ作成機能
- レシピ編集機能
- レシピ削除機能
- バリデーション機能

### Fixed
- フォーム送信時のエラーハンドリング

### Changed
- UIデザインの改善
```

## 🚨 マージ前チェックリスト

### 必須確認事項
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] 実装した機能が期待通り動作する
- [ ] 既存機能に影響がない
- [ ] コミットメッセージが適切
- [ ] 不要なファイルが含まれていない

### 推奨確認事項
- [ ] レスポンシブデザインが適用されている
- [ ] エラーハンドリングが適切
- [ ] ユーザビリティが考慮されている
- [ ] コメントが適切に書かれている

## 💾 バックアップ・復旧

### 重要なファイル
```
.env（ローカル環境変数）
prisma/dev.db（開発用データベース）
src/（ソースコード）
package.json（依存関係）
```

### 緊急時の復旧手順
1. 最新のmainブランチをpull
2. node_modulesを削除・再インストール
3. データベースをリセット
4. 環境変数を再設定

```bash
# 復旧コマンド例
git checkout main
git pull origin main
rm -rf node_modules package-lock.json
npm install
npx prisma migrate reset --force
npx prisma db seed
```

## 🔐 セキュリティ

### .gitignoreに含めるべきファイル
```gitignore
# 環境変数
.env
.env.local
.env.production

# データベース
prisma/dev.db
prisma/dev.db-journal

# ビルド成果物
.next/
out/
dist/

# 依存関係
node_modules/

# ログファイル
*.log

# エディタ設定
.vscode/settings.json
.idea/

# OS生成ファイル
.DS_Store
Thumbs.db
```

### 機密情報の管理
- APIキー、パスワードは.envファイルで管理
- .envファイルは絶対にcommitしない
- .env.exampleファイルで設定例を共有

## 📊 プロジェクト進捗管理

### GitHub Issues活用
```
# Issue例
Title: レシピ作成フォームのバリデーション実装

## 概要
レシピ作成時に入力データの検証を行う

## 要件
- [ ] 必須項目のチェック
- [ ] 文字数制限のチェック
- [ ] エラーメッセージの表示

## 関連ファイル
- schemas/recipe.ts
- components/recipe/RecipeForm.tsx
```

### マイルストーン設定
- **Sprint 1**: プロジェクト基盤（1週間）
- **Sprint 2**: CRUD機能（1週間）
- **Sprint 3**: 検索・UI改善（1週間）
- **Sprint 4**: MVP完成・テスト（1週間）
