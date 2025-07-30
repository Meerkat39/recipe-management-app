# 開発規約・スタイルガイド - レシピ管理アプリ

## 📋 目次
1. [TypeScript規約](#typescript規約)
2. [React/Next.js規約](#reactnextjs規約)
3. [ファイル・フォルダ構成](#ファイルフォルダ構成)
4. [命名規則](#命名規則)
5. [Tailwind CSS規約](#tailwind-css規約)
6. [コメント・ドキュメント](#コメントドキュメント)

## 🔷 TypeScript規約

### 基本ルール
```typescript
// ✅ 良い例
interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
}

// ❌ 避ける例
interface recipe {
  id: any;
  title;
  cookingTime: Number;
}
```

### 型定義
- **Interface vs Type**: 拡張可能性が必要な場合は `interface`、それ以外は `type`
- **Optional Properties**: 必須でないプロパティには `?` を使用
- **Union Types**: 明確な値セットには Union Types を活用

```typescript
// 適切な型定義例
interface Recipe {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string; // オプショナル
}

type RecipeFormData = Omit<Recipe, 'id' | 'createdAt'>;
```

### 関数型定義
```typescript
// ✅ 明確な型定義
type RecipeHandler = (recipe: Recipe) => void;
type SearchFilter = (recipes: Recipe[], query: string) => Recipe[];

// コンポーネントのProps
interface ComponentProps {
  recipes: Recipe[];
  onRecipeSelect: RecipeHandler;
  isLoading?: boolean;
}
```

## ⚛️ React/Next.js規約

### コンポーネント構造
```typescript
// ✅ 推奨構造
interface ComponentProps {
  // Props型定義
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  
  // 2. イベントハンドラー
  const handleClick = () => {
    // ロジック
  };
  
  // 3. JSX return
  return (
    <div>
      {/* コンポーネント内容 */}
    </div>
  );
}
```

### Hooks使用規則
```typescript
// ✅ 適切なHooks使用
export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // 副作用処理
  }, []);
  
  return (/* JSX */);
}
```

### Next.js App Router
```typescript
// app/recipes/page.tsx
export default function RecipesPage() {
  return <RecipeList />;
}

// app/recipes/[id]/page.tsx
interface RecipePageProps {
  params: { id: string };
}

export default function RecipePage({ params }: RecipePageProps) {
  return <RecipeDetail id={params.id} />;
}
```

## 📁 ファイル・フォルダ構成

### ディレクトリ構造
```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ホームページ
│   ├── recipes/           # レシピ関連ページ
│   │   ├── page.tsx       # レシピ一覧
│   │   ├── [id]/          # 動的ルーティング
│   │   │   └── page.tsx   # レシピ詳細
│   │   └── new/           # 新規作成
│   │       └── page.tsx
│   └── globals.css        # グローバルCSS
├── components/            # コンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── recipe/           # レシピ関連コンポーネント
│   │   ├── RecipeCard.tsx
│   │   ├── RecipeForm.tsx
│   │   └── RecipeList.tsx
│   └── layout/           # レイアウトコンポーネント
│       ├── Header.tsx
│       └── Navigation.tsx
├── lib/                  # ユーティリティ
│   ├── utils.ts          # 汎用ユーティリティ
│   ├── storage.ts        # ローカルストレージ操作
│   └── validation.ts     # バリデーション
├── types/                # 型定義
│   ├── recipe.ts         # レシピ関連型
│   └── common.ts         # 共通型
└── data/                 # データ・定数
    ├── mockRecipes.ts    # モックデータ
    └── constants.ts      # 定数定義
```

### ファイル命名規則
- **コンポーネント**: PascalCase (`RecipeCard.tsx`)
- **ページ**: kebab-case または page.tsx
- **ユーティリティ**: camelCase (`utils.ts`)
- **型定義**: camelCase (`recipe.ts`)

## 🏷️ 命名規則

### 変数・関数名
```typescript
// ✅ 良い例
const recipeList = [];
const isLoading = false;
const handleRecipeSubmit = () => {};
const fetchRecipeById = async (id: string) => {};

// ❌ 避ける例
const list = [];
const loading = false;
const submit = () => {};
const fetch = async (id) => {};
```

### コンポーネント名
```typescript
// ✅ 良い例
export default function RecipeCard() {}
export default function RecipeDetailPage() {}
export default function SearchInput() {}

// ❌ 避ける例
export default function Card() {}
export default function Detail() {}
export default function Input() {}
```

### 定数名
```typescript
// ✅ 定数は UPPER_CASE
const MAX_RECIPE_TITLE_LENGTH = 100;
const DEFAULT_COOKING_TIME = 30;
const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard'] as const;
```

## 🎨 Tailwind CSS規約

### クラス記述順序
```tsx
// ✅ 推奨順序: レイアウト → スペーシング → 外観 → インタラクション
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

### レスポンシブデザイン
```tsx
// ✅ モバイルファースト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### カスタムコンポーネントのスタイル
```tsx
// ✅ 基本スタイルを定数として定義
const buttonStyles = {
  base: "px-4 py-2 rounded-md font-medium transition-colors",
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
};
```

## 📝 コメント・ドキュメント

### コンポーネントドキュメント
```typescript
/**
 * レシピカードコンポーネント
 * レシピの基本情報を表示し、クリックで詳細ページに遷移
 * 
 * @param recipe - 表示するレシピデータ
 * @param onRecipeClick - レシピクリック時のハンドラー
 */
interface RecipeCardProps {
  recipe: Recipe;
  onRecipeClick: (id: string) => void;
}
```

### 複雑なロジックへのコメント
```typescript
// レシピを材料名で検索（部分一致、大文字小文字無視）
const searchRecipesByIngredient = (recipes: Recipe[], ingredient: string) => {
  const normalizedIngredient = ingredient.toLowerCase().trim();
  
  return recipes.filter(recipe => 
    recipe.ingredients.some(ing => 
      ing.name.toLowerCase().includes(normalizedIngredient)
    )
  );
};
```

### TODO・FIXME
```typescript
// TODO: 画像アップロード機能を実装
// FIXME: バリデーションエラーメッセージの表示改善が必要
// NOTE: この実装は一時的なもの、後でAPIに置き換え
```

## 🔧 ESLint・Prettier設定

### 基本ルール
- セミコロン: 必須
- クォート: シングルクォート
- インデント: 2スペース
- 末尾カンマ: 必須

## 🚀 パフォーマンス規約

### 画像最適化
```tsx
import Image from 'next/image';

// ✅ Next.js Image コンポーネントを使用
<Image
  src={recipe.imageUrl}
  alt={recipe.title}
  width={300}
  height={200}
  className="rounded-lg"
/>
```

### 動的インポート
```typescript
// ✅ 大きなコンポーネントは動的インポート
const RecipeEditor = dynamic(() => import('./RecipeEditor'), {
  loading: () => <div>Loading...</div>
});
```

このガイドに従って開発を進めることで、保守性と品質の高いコードを書くことができます。GitHub Copilotもこれらの規約を理解して、より適切なコードを生成してくれるでしょう。
