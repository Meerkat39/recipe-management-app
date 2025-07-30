# 実装ガイドライン

## 🚀 実装開始前の決定事項

### 📋 開発環境セットアップ

#### 必要なツール
- **Node.js**: v18.17.0 以上
- **npm/yarn/pnpm**: パッケージマネージャー（推奨: npm）
- **Git**: バージョン管理
- **VS Code**: エディタ（推奨拡張機能あり）

#### VS Code推奨拡張機能
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "Prisma.prisma",
    "formulahendry.auto-rename-tag"
  ]
}
```

### 🎨 コーディング規約

#### ファイル・ディレクトリ命名
```
✅ 良い例
components/ui/Button.tsx
lib/recipe-service.ts
app/recipes/new/page.tsx

❌ 悪い例
Components/UI/button.tsx
lib/RecipeService.ts
app/Recipes/New/Page.tsx
```

#### 命名規則
- **ファイル名**: kebab-case (`recipe-service.ts`)
- **コンポーネント**: PascalCase (`RecipeForm`)
- **関数・変数**: camelCase (`createRecipe`)
- **定数**: UPPER_SNAKE_CASE (`MAX_INGREDIENTS`)
- **型・インターフェース**: PascalCase (`Recipe`, `CreateRecipeData`)

#### コンポーネント記述順序
```typescript
// 1. imports
import React from 'react'
import { Button } from '@/components/ui/Button'

// 2. 型定義
interface RecipeFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Recipe
}

// 3. コンポーネント
export function RecipeForm({ mode, defaultValues }: RecipeFormProps) {
  // 実装
}

// 4. default export（必要な場合）
export default RecipeForm
```

### 🗂️ インポートエイリアス設定

```typescript
// tsconfig.json / next.config.js で設定
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"],
    "@/app/*": ["./src/app/*"],
    "@/schemas/*": ["./src/schemas/*"],
    "@/types/*": ["./src/types/*"]
  }
}
```

### 📦 初期パッケージ構成

#### 必須依存関係
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "prisma": "^5.0.0",
    "zod": "^3.22.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

### 🎯 MVP実装優先順位

#### Phase 1A: プロジェクト基盤（1日目）
1. ✅ Next.js プロジェクト作成
2. ✅ Tailwind CSS セットアップ
3. ✅ ディレクトリ構造作成
4. ✅ 基本レイアウト作成

#### Phase 1B: データ層（2日目）
1. ✅ Prisma セットアップ
2. ✅ データベーススキーマ定義
3. ✅ Zodバリデーションスキーマ作成
4. ✅ 基本的なSeed データ作成

#### Phase 1C: UI基盤（3日目）
1. ✅ 基本UIコンポーネント作成
2. ✅ レイアウトコンポーネント作成
3. ✅ ページルーティング設定

#### Phase 1D: CRUD機能（4-5日目）
1. ✅ レシピ一覧表示
2. ✅ レシピ詳細表示
3. ✅ レシピ作成機能
4. ✅ レシピ編集・削除機能

#### Phase 1E: 検索機能（6日目）
1. ✅ 基本検索機能
2. ✅ 検索結果表示

### 🛡️ エラーハンドリング方針

#### 各層でのエラー処理
```typescript
// Server Actions レベル
export async function createRecipeAction(formData: FormData) {
  try {
    // 処理
    return { success: true, data: recipe }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: 'バリデーションエラー', details: error.errors }
    }
    return { success: false, error: 'レシピの作成に失敗しました' }
  }
}

// コンポーネントレベル
export function RecipeForm() {
  const [error, setError] = useState<string | null>(null)
  
  return (
    <form action={async (formData) => {
      const result = await createRecipeAction(formData)
      if (!result.success) {
        setError(result.error)
      }
    }}>
      {error && <div className="text-red-500">{error}</div>}
      {/* フォーム内容 */}
    </form>
  )
}
```

### 🧪 開発中の確認事項

#### 各機能実装後のチェックリスト
- [ ] TypeScriptエラーがない
- [ ] ESLintエラーがない
- [ ] ブラウザコンソールにエラーがない
- [ ] 期待通りの動作をする
- [ ] レスポンシブデザインが適用されている
- [ ] アクセシビリティ（基本的なもの）が考慮されている

### 🔄 Git運用ルール

#### ブランチ命名
```
feature/recipe-crud    # 機能追加
fix/validation-error   # バグ修正
docs/update-readme     # ドキュメント更新
```

#### コミットメッセージ
```
feat: レシピ作成機能を追加
fix: バリデーションエラーの表示を修正
docs: READMEにセットアップ手順を追加
style: コードフォーマットを修正
refactor: RecipeServiceの構造を改善
```

### 🚨 実装中に迷ったときの判断基準

#### 1. **シンプルさ優先**
- 複雑な実装よりも、まず動くものを作る
- 後で改善できるような設計にする

#### 2. **型安全性**
- `any`型は避ける
- 可能な限りTypeScriptの恩恵を受ける

#### 3. **責任分離**
- 1つのファイル/関数は1つの責任だけ
- 迷ったら分割する

#### 4. **ユーザビリティ**
- エラーメッセージはわかりやすく
- ローディング状態を表示
- 適切なフィードバックを提供

### 📚 参考リソース

#### 公式ドキュメント
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma](https://www.prisma.io/docs)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

#### 実装で困ったときの質問テンプレート
```
## 何をしようとしているか
レシピ作成フォームでバリデーションエラーを表示したい

## 現在の状況
- ファイル: app/recipes/new/page.tsx
- エラー: TypeScriptエラー「Property 'errors' does not exist」
- 試したこと: zodのparse()を使用

## 期待する結果
バリデーションエラーをユーザーにわかりやすく表示したい
```

## 🎬 実装開始準備

### まずやること
1. Next.jsプロジェクトの作成
2. 基本的な設定ファイルの作成
3. ディレクトリ構造の作成
4. 最初のページ作成

**準備完了！実装を始めましょう🚀**
