# レシピ管理アプリケーション - ディレクトリ構成

## 📁 プロジェクト全体構成

```
recipe-management-app/
├── prisma/                     # Prismaスキーマとマイグレーション
│   ├── schema.prisma          # データベーススキーマ定義
│   ├── migrations/            # マイグレーションファイル
│   └── seed.ts                # シードデータ
├── public/                     # 静的ファイル
│   ├── images/                # 画像ファイル
│   └── favicon.ico            # ファビコン
├── src/                        # アプリケーションソースコード
│   ├── app/                   # Next.js App Router
│   ├── components/            # UIコンポーネント
│   ├── lib/                   # ユーティリティ・サービス
│   ├── schemas/               # Zodスキーマ
│   └── types/                 # TypeScript型定義
├── learning_notes/            # 学習メモ・記録
│   ├── README.md             # 学習メモの概要
│   ├── concepts/             # 概念・理論の学習メモ
│   ├── implementations/      # 実装時の学習メモ
│   ├── troubleshooting/      # 問題解決の記録
│   └── tips/                 # 便利なTipsやコツ
├── docs/                       # プロジェクトドキュメント
│   ├── requirements.md        # 要件定義書
│   ├── database-design.md     # DB設計書
│   ├── tech-stack.md          # 技術スタック選定書
│   ├── directory-structure.md # このファイル
│   ├── implementation-guide.md # 実装ガイドライン
│   ├── implementation-todo.md # 実装TODO管理
│   ├── git-guide.md           # Git運用ガイド
│   ├── project-overview.md    # プロジェクト概要
│   ├── mvp-requirements.md    # MVP要件定義
│   ├── database-diagram.md    # データベース関係図
│   ├── ai-development-guide.md # AI開発ガイド
│   ├── coding-standards.md    # コーディング規約
│   └── learning-notes-guide.md # 学習メモ作成ルール
├── .env                        # 環境変数（開発用）
├── .env.example               # 環境変数のテンプレート
├── .gitignore                 # Git除外ファイル
├── package.json               # パッケージ定義
├── tsconfig.json              # TypeScript設定
├── tailwind.config.ts         # Tailwind CSS設定
├── next.config.js             # Next.js設定
├── eslint.config.js           # ESLint設定
├── prettier.config.js         # Prettier設定
└── README.md                  # プロジェクト概要
```

## 🗂️ src/ ディレクトリ詳細

### app/ - Next.js App Router

```
src/app/
├── globals.css                # グローバルCSS
├── layout.tsx                 # ルートレイアウト
├── page.tsx                   # ホームページ
├── loading.tsx                # ローディングUI
├── error.tsx                  # エラーページ
├── not-found.tsx              # 404ページ
├── actions/                   # Server Actions
│   ├── recipes.ts            # レシピ関連Server Actions
│   └── index.ts              # Actions エクスポート
├── api/                       # API Routes（必要時のみ）
│   └── health/               # ヘルスチェック
│       └── route.ts          # GET /api/health
└── recipes/                   # レシピページ
    ├── page.tsx              # レシピ一覧ページ
    ├── loading.tsx           # 一覧ローディング
    ├── error.tsx             # 一覧エラー
    ├── new/                  # 新規作成
    │   └── page.tsx         # レシピ作成ページ（Server Actions使用）
    └── [id]/                 # 動的ルーティング
        ├── page.tsx         # レシピ詳細ページ
        ├── loading.tsx      # 詳細ローディング
        ├── error.tsx        # 詳細エラー
        └── edit/            # 編集ページ
            └── page.tsx     # レシピ編集ページ（Server Actions使用）
```

### components/ - UI コンポーネント

```
src/components/
├── ui/                        # 基本UIコンポーネント
│   ├── Button.tsx            # ボタンコンポーネント
│   ├── Input.tsx             # 入力フィールド
│   ├── Card.tsx              # カードコンポーネント
│   ├── Modal.tsx             # モーダルダイアログ
│   ├── Loading.tsx           # ローディングスピナー
│   ├── ErrorMessage.tsx      # エラーメッセージ
│   └── index.ts              # エクスポート集約
├── recipe/                    # レシピ専用コンポーネント
│   ├── RecipeCard.tsx        # レシピカード
│   ├── RecipeList.tsx        # レシピ一覧
│   ├── RecipeDetail.tsx      # レシピ詳細
│   ├── RecipeForm.tsx        # レシピフォーム
│   ├── IngredientList.tsx    # 材料リスト
│   ├── InstructionList.tsx   # 手順リスト
│   └── index.ts              # エクスポート集約
├── layout/                    # レイアウトコンポーネント
│   ├── Header.tsx            # ヘッダー
│   ├── Navigation.tsx        # ナビゲーション
│   ├── Footer.tsx            # フッター
│   └── Sidebar.tsx           # サイドバー（将来用）
└── common/                    # 共通コンポーネント
    ├── SearchBar.tsx         # 検索バー
    ├── Pagination.tsx        # ページネーション
    ├── ConfirmDialog.tsx     # 確認ダイアログ
    └── NotFound.tsx          # データなし表示
```

### lib/ - ユーティリティ・サービス

```
src/lib/
├── prisma.ts                  # Prisma Client設定
├── recipe-service.ts          # レシピサービス
├── utils.ts                   # 汎用ユーティリティ
├── constants.ts               # 定数定義
├── validations.ts             # バリデーション関数
├── formatters.ts              # データフォーマット関数
├── api-client.ts              # API呼び出し関数
├── error-handler.ts           # エラーハンドリング
└── db/                        # データベース関連
    ├── migrations.ts          # マイグレーション実行
    └── seed.ts                # シードデータ投入
```

### schemas/ - Zod スキーマ

```
src/schemas/
├── recipe.ts                  # レシピバリデーションスキーマ
├── ingredient.ts              # 材料バリデーションスキーマ
├── common.ts                  # 共通スキーマ
└── api/                       # API用スキーマ
    ├── request.ts            # リクエストスキーマ
    └── response.ts           # レスポンススキーマ
```

### types/ - TypeScript 型定義

```
src/types/
├── index.ts                   # 基本型定義
├── recipe.ts                  # レシピ関連型
├── api.ts                     # API関連型
├── ui.ts                      # UI関連型
└── database.ts                # データベース型（Prisma補完）
```

## 🔍 ディレクトリ内部構成詳細

### 📱 app/ 内の詳細構成

#### Server Actions の構成パターン

```typescript
// app/actions/recipes.ts - Server Actions
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CreateRecipeSchema, UpdateRecipeSchema } from "@/schemas/recipe";
import { RecipeService } from "@/lib/recipe-service";

// レシピ作成 Server Action
export async function createRecipeAction(formData: FormData) {
  try {
    // FormData から生データを取得
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      cookingTimeMinutes: Number(formData.get("cookingTimeMinutes")),
      servings: Number(formData.get("servings")),
      ingredients: JSON.parse(formData.get("ingredients") as string),
      instructions: JSON.parse(formData.get("instructions") as string),
    };

    // Zodでバリデーション
    const validatedData = CreateRecipeSchema.parse(rawData);

    // サービス層でビジネスロジック実行
    const recipe = await RecipeService.createRecipe(validatedData);

    // キャッシュ無効化
    revalidatePath("/recipes");

    // 作成されたレシピページにリダイレクト
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    // エラーハンドリング
    if (error instanceof z.ZodError) {
      return { error: "バリデーションエラー", details: error.errors };
    }
    return { error: "レシピの作成に失敗しました" };
  }
}

// レシピ更新 Server Action
export async function updateRecipeAction(id: string, formData: FormData) {
  try {
    const rawData = {
      id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      cookingTimeMinutes: Number(formData.get("cookingTimeMinutes")),
      servings: Number(formData.get("servings")),
      ingredients: JSON.parse(formData.get("ingredients") as string),
      instructions: JSON.parse(formData.get("instructions") as string),
    };

    const validatedData = UpdateRecipeSchema.parse(rawData);
    const recipe = await RecipeService.updateRecipe(validatedData);

    revalidatePath("/recipes");
    revalidatePath(`/recipes/${id}`);

    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "バリデーションエラー", details: error.errors };
    }
    return { error: "レシピの更新に失敗しました" };
  }
}

// レシピ削除 Server Action
export async function deleteRecipeAction(id: string) {
  try {
    await RecipeService.deleteRecipe(id);
    revalidatePath("/recipes");
    redirect("/recipes");
  } catch (error) {
    return { error: "レシピの削除に失敗しました" };
  }
}
```

#### API Routes の構成パターン

```typescript
// app/api/recipes/route.ts
export async function GET(request: Request) {
  // レシピ一覧取得
}

export async function POST(request: Request) {
  // レシピ作成
}

// app/api/recipes/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // レシピ詳細取得
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // レシピ更新
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // レシピ削除
}
```

#### Page の構成パターン (Server Actions 使用)

```typescript
// app/recipes/page.tsx - 一覧ページ
export default function RecipesPage() {
  return <RecipeList />;
}

// app/recipes/[id]/page.tsx - 詳細ページ
interface RecipePageProps {
  params: { id: string };
}

export default function RecipePage({ params }: RecipePageProps) {
  return <RecipeDetail id={params.id} />;
}

// app/recipes/new/page.tsx - 作成ページ (Server Actions使用)
import { createRecipeAction } from "@/app/actions/recipes";

export default function NewRecipePage() {
  return (
    <div>
      <h1>新しいレシピを作成</h1>
      <form action={createRecipeAction}>
        <RecipeForm mode="create" />
        <button type="submit">レシピを作成</button>
      </form>
    </div>
  );
}

// app/recipes/[id]/edit/page.tsx - 編集ページ (Server Actions使用)
import { updateRecipeAction } from "@/app/actions/recipes";
import { RecipeService } from "@/lib/recipe-service";

interface EditRecipePageProps {
  params: { id: string };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const recipe = await RecipeService.getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

  const updateWithId = updateRecipeAction.bind(null, params.id);

  return (
    <div>
      <h1>レシピを編集</h1>
      <form action={updateWithId}>
        <RecipeForm mode="edit" defaultValues={recipe} />
        <button type="submit">レシピを更新</button>
      </form>
    </div>
  );
}
```

### 🧩 components/ 内の詳細構成

#### ui/ コンポーネントの設計

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ variant = 'primary', size = 'md', ... }: ButtonProps) {
  // 実装
}

// components/ui/Input.tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'number' | 'password';
}

export function Input({ label, error, ...props }: InputProps) {
  // 実装
}

// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, padding = 'md', ...props }: CardProps) {
  // 実装
}
```

#### recipe/ コンポーネントの設計 (Server Actions 対応)

```typescript
// components/recipe/RecipeCard.tsx
interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onView,
}: RecipeCardProps) {
  // 実装
}

// components/recipe/RecipeForm.tsx - Server Actions対応
interface RecipeFormProps {
  mode: "create" | "edit";
  defaultValues?: Recipe;
  className?: string;
}

export function RecipeForm({
  mode,
  defaultValues,
  className,
}: RecipeFormProps) {
  // Server Actionsを使用するため、onSubmitは不要
  // formはページレベルで定義され、actionが設定される

  return (
    <div className={className}>
      {/* 基本情報 */}
      <div>
        <label htmlFor="title">レシピ名</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      <div>
        <label htmlFor="description">説明</label>
        <textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
        />
      </div>

      <div>
        <label htmlFor="cookingTimeMinutes">調理時間（分）</label>
        <input
          type="number"
          id="cookingTimeMinutes"
          name="cookingTimeMinutes"
          defaultValue={defaultValues?.cookingTimeMinutes}
          required
        />
      </div>

      <div>
        <label htmlFor="servings">人数</label>
        <input
          type="number"
          id="servings"
          name="servings"
          defaultValue={defaultValues?.servings}
          required
        />
      </div>

      {/* 材料リスト */}
      <IngredientsInput defaultValues={defaultValues?.ingredients} />

      {/* 手順リスト */}
      <InstructionsInput defaultValues={defaultValues?.instructions} />
    </div>
  );
}

// components/recipe/IngredientsInput.tsx - Server Actions対応
interface IngredientsInputProps {
  defaultValues?: Ingredient[];
}

export function IngredientsInput({
  defaultValues = [],
}: IngredientsInputProps) {
  const [ingredients, setIngredients] = useState(defaultValues);

  return (
    <div>
      <h3>材料</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="材料名"
            defaultValue={ingredient.name}
            onChange={(e) => updateIngredient(index, "name", e.target.value)}
          />
          <input
            type="text"
            placeholder="分量"
            defaultValue={ingredient.amount}
            onChange={(e) => updateIngredient(index, "amount", e.target.value)}
          />
          <input
            type="text"
            placeholder="単位"
            defaultValue={ingredient.unit}
            onChange={(e) => updateIngredient(index, "unit", e.target.value)}
          />
          <button type="button" onClick={() => removeIngredient(index)}>
            削除
          </button>
        </div>
      ))}

      {/* Server Actionsで送信するためのhidden input */}
      <input
        type="hidden"
        name="ingredients"
        value={JSON.stringify(ingredients)}
      />

      <button type="button" onClick={addIngredient}>
        材料を追加
      </button>
    </div>
  );
}

// components/recipe/InstructionsInput.tsx - Server Actions対応
interface InstructionsInputProps {
  defaultValues?: string[];
}

export function InstructionsInput({
  defaultValues = [""],
}: InstructionsInputProps) {
  const [instructions, setInstructions] = useState(defaultValues);

  return (
    <div>
      <h3>作り方</h3>
      {instructions.map((instruction, index) => (
        <div key={index}>
          <label>手順 {index + 1}</label>
          <textarea
            placeholder="手順を入力"
            defaultValue={instruction}
            onChange={(e) => updateInstruction(index, e.target.value)}
          />
          <button type="button" onClick={() => removeInstruction(index)}>
            削除
          </button>
        </div>
      ))}

      {/* Server Actionsで送信するためのhidden input */}
      <input
        type="hidden"
        name="instructions"
        value={JSON.stringify(instructions)}
      />

      <button type="button" onClick={addInstruction}>
        手順を追加
      </button>
    </div>
  );
}
```

#### layout/ コンポーネントの設計

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  showSearch?: boolean;
  showNavigation?: boolean;
}

export function Header({
  showSearch = true,
  showNavigation = true,
}: HeaderProps) {
  // 実装
}

// components/layout/Navigation.tsx
interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  active?: boolean;
}

interface NavigationProps {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
}

export function Navigation({
  items,
  orientation = "horizontal",
}: NavigationProps) {
  // 実装
}
```

### 📚 lib/ 内の詳細構成

#### サービス層の設計

```typescript
// lib/recipe-service.ts
export class RecipeService {
  // CRUD操作
  async createRecipe(data: CreateRecipe): Promise<Recipe> {}
  async getRecipes(params: SearchRecipe): Promise<RecipeListResponse> {}
  async getRecipeById(id: string): Promise<Recipe | null> {}
  async updateRecipe(data: UpdateRecipe): Promise<Recipe> {}
  async deleteRecipe(id: string): Promise<void> {}

  // 検索・フィルタリング
  async searchRecipes(query: string): Promise<Recipe[]> {}
  async getRecipesByCategory(category: string): Promise<Recipe[]> {}
}

// lib/api-client.ts
export class ApiClient {
  private baseUrl: string;

  async get<T>(endpoint: string): Promise<T> {}
  async post<T>(endpoint: string, data: any): Promise<T> {}
  async put<T>(endpoint: string, data: any): Promise<T> {}
  async delete(endpoint: string): Promise<void> {}
}

// lib/utils.ts
export function cn(...classes: (string | undefined)[]): string {}
export function formatCookingTime(minutes: number): string {}
export function formatServings(servings: number): string {}
export function generateSlug(title: string): string {}
```

#### バリデーション・フォーマッター

```typescript
// lib/validations.ts
export function validateRecipeData(data: unknown): CreateRecipe | null {}
export function validateIngredient(data: unknown): Ingredient | null {}
export function sanitizeInput(input: string): string {}

// lib/formatters.ts
export function formatDate(date: Date | string): string {}
export function formatRelativeTime(date: Date | string): string {}
export function formatIngredientAmount(ingredient: Ingredient): string {}
```

### 📝 schemas/ 内の詳細構成

#### バリデーションスキーマの分割

```typescript
// schemas/common.ts
export const BaseEntitySchema = z.object({
  id: z.string().cuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

// schemas/ingredient.ts
export const IngredientSchema = z.object({
  name: z.string().min(1).max(50),
  amount: z.string().min(1).max(20),
  unit: z.string().max(10),
});

export const IngredientListSchema = z.array(IngredientSchema).min(1).max(50);

// schemas/recipe.ts
export const RecipeBaseSchema = z.object({
  title: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  cookingTimeMinutes: z.number().int().min(1).max(1440),
  servings: z.number().int().min(1).max(20).default(2),
  instructions: z.array(z.string().min(1)).min(1).max(50),
});

export const CreateRecipeSchema = RecipeBaseSchema.extend({
  ingredients: IngredientListSchema,
});

export const UpdateRecipeSchema = CreateRecipeSchema.partial().extend({
  id: z.string().cuid(),
});
```

### 🏷️ types/ 内の詳細構成

#### 型定義の分類と管理

```typescript
// types/index.ts - 基本型
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// types/recipe.ts - レシピ関連
export interface Recipe extends BaseEntity {
  title: string;
  description?: string;
  cookingTimeMinutes: number;
  servings: number;
  instructions: string[];
  ingredients: Ingredient[];
}

export interface RecipeListResponse {
  recipes: Recipe[];
  pagination: PaginationResponse;
}

// types/ui.ts - UI関連
export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export type ButtonVariant = "primary" | "secondary" | "danger";
export type InputType = "text" | "email" | "number" | "password";

// types/api.ts - API関連
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}
```

## 📋 Phase 別ディレクトリ拡張計画

### Phase 2A 追加予定

```
src/
├── components/
│   ├── recipe/
│   │   ├── RecipeImage.tsx    # 画像表示コンポーネント
│   │   ├── CategoryFilter.tsx # カテゴリフィルター
│   │   └── TagSelector.tsx    # タグ選択
│   └── upload/                # アップロード関連
│       └── ImageUpload.tsx    # 画像アップロード
├── lib/
│   ├── upload-service.ts      # ファイルアップロード
│   └── image-utils.ts         # 画像処理
└── schemas/
    ├── category.ts            # カテゴリスキーマ
    └── upload.ts              # アップロードスキーマ
```

### Phase 2B 追加予定

```
src/
├── app/
│   ├── auth/                  # 認証ページ
│   │   ├── login/
│   │   └── register/
│   └── profile/               # プロフィールページ
├── components/
│   ├── auth/                  # 認証コンポーネント
│   └── profile/               # プロフィール関連
├── lib/
│   ├── auth.ts                # 認証設定
│   └── user-service.ts        # ユーザーサービス
└── middleware.ts              # 認証ミドルウェア
```

## 🎯 ファイル命名規則

### コンポーネント

- **PascalCase**: `RecipeCard.tsx`, `IngredientList.tsx`
- **index.ts**: エクスポート集約ファイル

### ページ

- **lowercase**: `page.tsx`, `loading.tsx`, `error.tsx`
- **API Routes**: `route.ts`

### ユーティリティ・サービス

- **kebab-case**: `recipe-service.ts`, `api-client.ts`
- **camelCase**: 関数・変数名

### スキーマ・型定義

- **lowercase**: `recipe.ts`, `common.ts`
- **descriptive**: 用途が分かる名前

## 📦 インポートエイリアス設定

### tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/schemas/*": ["./src/schemas/*"],
      "@/types/*": ["./src/types/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

### 使用例

```typescript
import { RecipeCard } from "@/components/recipe";
import { recipeService } from "@/lib/recipe-service";
import { CreateRecipeSchema } from "@/schemas/recipe";
import type { Recipe } from "@/types";
```

## 🔧 設定ファイル配置

### ルートディレクトリ設定ファイル

- **package.json**: 依存関係・スクリプト
- **tsconfig.json**: TypeScript 設定
- **next.config.js**: Next.js 設定
- **tailwind.config.ts**: Tailwind CSS 設定
- **eslint.config.js**: ESLint 設定
- **prettier.config.js**: Prettier 設定
- **.env**: 環境変数（Git 除外）
- **.env.example**: 環境変数テンプレート

この構成により、スケーラブルで保守性の高いプロジェクト構造を維持できます。
