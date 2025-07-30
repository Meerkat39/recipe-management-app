# レシピ管理アプリ - プロジェクト概要

## 🎯 プロジェクトの目的
AI駆動開発（GitHub Copilot）を活用して、実用的なレシピ管理Webアプリケーションを構築し、現代的な開発手法を習得する。

## 👥 対象ユーザー
- 料理が好きな人
- レシピを整理・管理したい人
- 新しいレシピを発見したい人
- 材料から料理を検索したい人

## 🔧 技術スタック
- **フロントエンド**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS v4
- **状態管理**: React Hooks (useState, useEffect)
- **データ管理**: ローカルストレージ（初期版）
- **開発支援**: GitHub Copilot, ESLint

## 📋 主要機能

### Phase 1: 基本機能
- [x] プロジェクトセットアップ
- [ ] レシピ一覧表示
- [ ] レシピ詳細表示
- [ ] 新規レシピ登録
- [ ] レシピ編集・削除
- [ ] レシピ検索（タイトル）

### Phase 2: 拡張機能
- [ ] カテゴリ別分類
- [ ] 材料から検索
- [ ] お気に入り機能
- [ ] 調理時間フィルター
- [ ] 難易度設定
- [ ] 画像アップロード

### Phase 3: 高度な機能
- [ ] レシピ共有機能
- [ ] 評価・レビュー
- [ ] 栄養情報表示
- [ ] 買い物リスト生成

## 🗂️ データ構造

### Recipe型
```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  cookingTime: number; // 分
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}
```

## 🎨 UI/UX設計方針
- **シンプル・直感的**: 誰でも使いやすいインターフェース
- **レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **視覚的**: レシピ画像を重視したカード形式
- **検索性**: 素早く目的のレシピを見つけられる

## 📁 プロジェクト構成
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # 共通レイアウト
│   ├── page.tsx        # ホームページ
│   ├── recipes/        # レシピ関連ページ
│   └── globals.css     # グローバルスタイル
├── components/         # 再利用可能コンポーネント
│   ├── ui/            # 基本UIコンポーネント
│   └── recipe/        # レシピ関連コンポーネント
├── lib/               # ユーティリティ・ヘルパー
├── types/             # TypeScript型定義
└── data/              # モックデータ・定数
```

## 🚀 開発フロー
1. **設計**: GitHub Copilotに要件を説明してコンポーネント設計
2. **実装**: Copilotと対話しながらコード生成
3. **レビュー**: 生成されたコードの確認・調整
4. **テスト**: 機能動作確認
5. **リファクタリング**: Copilotを活用したコード改善

## 🎓 学習目標
- GitHub Copilotの効果的な活用方法
- プロンプトエンジニアリング技術
- AI支援でのコード品質向上
- 効率的なフロントエンド開発手法
