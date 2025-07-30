# レシピ管理アプリケーション - MVP DB設計書（Prisma + Zod）

## 📊 エンティティ関係図 (ERD)

```
┌─────────────────────────────────────┐
│                Recipe               │
├─────────────────────────────────────┤
│ id: String (PK) @cuid()             │
│ title: String (100)                 │
│ description: String? (500)          │
│ cookingTimeMinutes: Int             │
│ servings: Int @default(2)           │
│ instructions: String (JSON)         │
│ createdAt: DateTime @default(now()) │
│ updatedAt: DateTime @updatedAt      │
└─────────────────────────────────────┘
                    │
                    │ 1:N
                    │
                    ▼
┌─────────────────────────────────────┐
│              Ingredient             │
├─────────────────────────────────────┤
│ id: String (PK) @cuid()             │
│ name: String (50)                   │
│ amount: String (20)                 │
│ unit: String (10)                   │
│ recipeId: String (FK)               │
└─────────────────────────────────────┘
```

### リレーション詳細
- **Recipe → Ingredient (1:N)**: 1つのレシピは複数の材料を持つ
- **外部キー**: `Ingredient.recipeId` → `Recipe.id`
- **削除制約**: `onDelete: Cascade` (レシピ削除時に関連材料も削除)

## 🗄️ Prismaスキーマ設計

### schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Recipe {
  id                  String       @id @default(cuid())
  title               String       @db.VarChar(100)
  description         String?      @db.VarChar(500)
  cookingTimeMinutes  Int
  servings            Int          @default(2)
  instructions        String       // JSON文字列として保存
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  ingredients         Ingredient[]

  @@map("recipes")
}

model Ingredient {
  id       String @id @default(cuid())
  name     String @db.VarChar(50)
  amount   String @db.VarChar(20)
  unit     String @db.VarChar(10)

  recipeId String
  recipe   Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@map("ingredients")
}
```

## 📋 テーブル詳細

### recipes テーブル
| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | String | PRIMARY KEY, CUID | 一意識別子 |
| title | String(100) | NOT NULL | レシピ名 |
| description | String(500) | NULLABLE | レシピの説明 |
| cookingTimeMinutes | Int | NOT NULL | 調理時間（分） |
| servings | Int | NOT NULL, DEFAULT(2) | 人数 |
| instructions | String | NOT NULL | 手順（JSON形式） |
| createdAt | DateTime | NOT NULL, DEFAULT(now()) | 作成日時 |
| updatedAt | DateTime | NOT NULL, @updatedAt | 更新日時 |

### ingredients テーブル
| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | String | PRIMARY KEY, CUID | 一意識別子 |
| name | String(50) | NOT NULL | 材料名 |
| amount | String(20) | NOT NULL | 分量 |
| unit | String(10) | NOT NULL | 単位 |
| recipeId | String | NOT NULL, FOREIGN KEY | レシピID（外部キー） |

## 🔍 Zodスキーマ定義

### schemas/recipe.ts

```typescript
import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "材料名は必須です").max(50),
  amount: z.string().min(1, "分量は必須です").max(20),
  unit: z.string().max(10),
  recipeId: z.string().cuid().optional(),
});

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "レシピ名は必須です").max(100).trim(),
  description: z.string().max(500).optional().or(z.literal("")),
  cookingTimeMinutes: z.number().int().min(1).max(1440),
  servings: z.number().int().min(1).max(20).default(2),
  instructions: z.array(z.string().min(1)).min(1).max(50),
  ingredients: z
    .array(IngredientSchema.omit({ id: true, recipeId: true }))
    .min(1)
    .max(50),
});

export const UpdateRecipeSchema = CreateRecipeSchema.partial().extend({
  id: z.string().cuid(),
});

export const SearchRecipeSchema = z.object({
  query: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>;
export type SearchRecipe = z.infer<typeof SearchRecipeSchema>;
```

## 🔧 Prismaサービス実装

### lib/recipe-service.ts

```typescript
import { PrismaClient } from "@prisma/client";
import { CreateRecipe, UpdateRecipe, SearchRecipe } from "@/schemas/recipe";

const prisma = new PrismaClient();

export class RecipeService {
  async createRecipe(data: CreateRecipe) {
    return await prisma.recipe.create({
      data: {
        ...data,
        instructions: JSON.stringify(data.instructions),
        ingredients: {
          create: data.ingredients,
        },
      },
      include: { ingredients: true },
    });
  }

  async getRecipes(params: SearchRecipe) {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: query, mode: 'insensitive' } } } },
      ],
    } : undefined;

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: { ingredients: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes: recipes.map(recipe => ({
        ...recipe,
        instructions: JSON.parse(recipe.instructions),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecipeById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!recipe) return null;

    return {
      ...recipe,
      instructions: JSON.parse(recipe.instructions),
    };
  }

  async updateRecipe(data: UpdateRecipe) {
    const { id, ingredients, ...recipeData } = data;

    return await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({ where: { recipeId: id } });

      return await tx.recipe.update({
        where: { id },
        data: {
          ...recipeData,
          instructions: recipeData.instructions ? JSON.stringify(recipeData.instructions) : undefined,
          ingredients: ingredients ? { create: ingredients } : undefined,
        },
        include: { ingredients: true },
      });
    });
  }

  async deleteRecipe(id: string) {
    return await prisma.recipe.delete({ where: { id } });
  }
}

export const recipeService = new RecipeService();
```

## 🎯 データ例・クエリパターン

### レシピデータ例
```sql
-- recipes テーブル
INSERT INTO recipes (id, title, description, cookingTimeMinutes, servings, instructions, createdAt, updatedAt)
VALUES 
  ('clv123abc', 'チャーハン', '基本的なチャーハンです', 15, 2, 
   '["卵を溶く", "フライパンを熱する", "ご飯を炒める", "調味料を加える"]',
   '2025-07-30 10:00:00', '2025-07-30 10:00:00');

-- ingredients テーブル
INSERT INTO ingredients (id, name, amount, unit, recipeId)
VALUES 
  ('ing001', 'ご飯', '300', 'g', 'clv123abc'),
  ('ing002', '卵', '2', '個', 'clv123abc'),
  ('ing003', '醤油', '大さじ1', '', 'clv123abc'),
  ('ing004', '長ねぎ', '1/2', '本', 'clv123abc');
```

### 主要なクエリパターン
```sql
-- 1. レシピ一覧取得（材料付き）
SELECT r.*, i.name as ingredient_name, i.amount, i.unit
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
ORDER BY r.updatedAt DESC;

-- 2. レシピ検索（タイトル・材料名）
SELECT DISTINCT r.*
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
WHERE r.title LIKE '%チャーハン%' 
   OR r.description LIKE '%チャーハン%'
   OR i.name LIKE '%チャーハン%';
```

## 📦 セットアップ

### 必要なパッケージ
```bash
npm install @prisma/client zod
npm install -D prisma
```

### 環境設定
```bash
# .env
DATABASE_URL="file:./dev.db"
```

### 初期化コマンド
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## 🚀 将来の拡張計画

### Phase 2A 拡張予定
```
┌─────────────────────┐      ┌─────────────────────┐
│       Recipe        │      │      Category       │
│                     │      │                     │
├─────────────────────┤      ├─────────────────────┤
│ + difficulty        │ M:N  │ id: String (PK)     │
│ + categories        │◄────►│ name: String        │
│ + tags             │      │ color: String?      │
│ + images           │      └─────────────────────┘
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│    RecipeImage      │
├─────────────────────┤
│ id: String (PK)     │
│ url: String         │
│ alt: String?        │
│ order: Int          │
│ recipeId: String    │
└─────────────────────┘
```

### schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model Recipe {
  id                  String       @id @default(cuid())
  title               String       @db.VarChar(100)
  description         String?      @db.VarChar(500)
  cookingTimeMinutes  Int
  servings            Int          @default(2)
  instructions        String       // JSON文字列として保存
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  ingredients         Ingredient[]

  @@map("recipes")
}

model Ingredient {
  id       String @id @default(cuid())
  name     String @db.VarChar(50)
  amount   String @db.VarChar(20)
  unit     String @db.VarChar(10)

  recipeId String
  recipe   Recipe @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@map("ingredients")
}
```

## � テーブル詳細

### recipes テーブル
| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | String | PRIMARY KEY, CUID | 一意識別子 |
| title | String(100) | NOT NULL | レシピ名 |
| description | String(500) | NULLABLE | レシピの説明 |
| cookingTimeMinutes | Int | NOT NULL | 調理時間（分） |
| servings | Int | NOT NULL, DEFAULT(2) | 人数 |
| instructions | String | NOT NULL | 手順（JSON形式） |
| createdAt | DateTime | NOT NULL, DEFAULT(now()) | 作成日時 |
| updatedAt | DateTime | NOT NULL, @updatedAt | 更新日時 |

### ingredients テーブル
| カラム名 | データ型 | 制約 | 説明 |
|----------|----------|------|------|
| id | String | PRIMARY KEY, CUID | 一意識別子 |
| name | String(50) | NOT NULL | 材料名 |
| amount | String(20) | NOT NULL | 分量 |
| unit | String(10) | NOT NULL | 単位 |
| recipeId | String | NOT NULL, FOREIGN KEY | レシピID（外部キー） |

## �🔍 Zodスキーマ定義

### schemas/recipe.ts

```typescript
import { z } from "zod";

export const IngredientSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1, "材料名は必須です").max(50),
  amount: z.string().min(1, "分量は必須です").max(20),
  unit: z.string().max(10),
  recipeId: z.string().cuid().optional(),
});

export const CreateRecipeSchema = z.object({
  title: z.string().min(1, "レシピ名は必須です").max(100).trim(),
  description: z.string().max(500).optional().or(z.literal("")),
  cookingTimeMinutes: z.number().int().min(1).max(1440),
  servings: z.number().int().min(1).max(20).default(2),
  instructions: z.array(z.string().min(1)).min(1).max(50),
  ingredients: z
    .array(IngredientSchema.omit({ id: true, recipeId: true }))
    .min(1)
    .max(50),
});

export const UpdateRecipeSchema = CreateRecipeSchema.partial().extend({
  id: z.string().cuid(),
});

export const SearchRecipeSchema = z.object({
  query: z.string().trim().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type CreateRecipe = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipe = z.infer<typeof UpdateRecipeSchema>;
export type SearchRecipe = z.infer<typeof SearchRecipeSchema>;
```

## 🔧 Prismaサービス実装

### lib/recipe-service.ts

```typescript
import { PrismaClient } from "@prisma/client";
import { CreateRecipe, UpdateRecipe, SearchRecipe } from "@/schemas/recipe";

const prisma = new PrismaClient();

export class RecipeService {
  async createRecipe(data: CreateRecipe) {
    return await prisma.recipe.create({
      data: {
        ...data,
        instructions: JSON.stringify(data.instructions),
        ingredients: {
          create: data.ingredients,
        },
      },
      include: { ingredients: true },
    });
  }

  async getRecipes(params: SearchRecipe) {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = query ? {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: query, mode: 'insensitive' } } } },
      ],
    } : undefined;

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: { ingredients: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes: recipes.map(recipe => ({
        ...recipe,
        instructions: JSON.parse(recipe.instructions),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecipeById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!recipe) return null;

    return {
      ...recipe,
      instructions: JSON.parse(recipe.instructions),
    };
  }

  async updateRecipe(data: UpdateRecipe) {
    const { id, ingredients, ...recipeData } = data;

    return await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({ where: { recipeId: id } });

      return await tx.recipe.update({
        where: { id },
        data: {
          ...recipeData,
          instructions: recipeData.instructions ? JSON.stringify(recipeData.instructions) : undefined,
          ingredients: ingredients ? { create: ingredients } : undefined,
        },
        include: { ingredients: true },
      });
    });
  }

  async deleteRecipe(id: string) {
    return await prisma.recipe.delete({ where: { id } });
  }
}

export const recipeService = new RecipeService();
```

## 🎯 データ例・クエリパターン

### レシピデータ例
```sql
-- recipes テーブル
INSERT INTO recipes (id, title, description, cookingTimeMinutes, servings, instructions, createdAt, updatedAt)
VALUES 
  ('clv123abc', 'チャーハン', '基本的なチャーハンです', 15, 2, 
   '["卵を溶く", "フライパンを熱する", "ご飯を炒める", "調味料を加える"]',
   '2025-07-30 10:00:00', '2025-07-30 10:00:00');

-- ingredients テーブル
INSERT INTO ingredients (id, name, amount, unit, recipeId)
VALUES 
  ('ing001', 'ご飯', '300', 'g', 'clv123abc'),
  ('ing002', '卵', '2', '個', 'clv123abc'),
  ('ing003', '醤油', '大さじ1', '', 'clv123abc'),
  ('ing004', '長ねぎ', '1/2', '本', 'clv123abc');
```

### 主要なクエリパターン
```sql
-- 1. レシピ一覧取得（材料付き）
SELECT r.*, i.name as ingredient_name, i.amount, i.unit
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
ORDER BY r.updatedAt DESC;

-- 2. レシピ検索（タイトル・材料名）
SELECT DISTINCT r.*
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
WHERE r.title LIKE '%チャーハン%' 
   OR r.description LIKE '%チャーハン%'
   OR i.name LIKE '%チャーハン%';
```
    return await prisma.recipe.create({
      data: {
        ...data,
        instructions: JSON.stringify(data.instructions),
        ingredients: {
          create: data.ingredients,
        },
      },
      include: { ingredients: true },
    });
  }

  async getRecipes(params: SearchRecipe) {
    const { query, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            {
              ingredients: {
                some: { name: { contains: query, mode: "insensitive" } },
              },
            },
          ],
        }
      : undefined;

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        include: { ingredients: true },
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes: recipes.map((recipe) => ({
        ...recipe,
        instructions: JSON.parse(recipe.instructions),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRecipeById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!recipe) return null;

    return {
      ...recipe,
      instructions: JSON.parse(recipe.instructions),
    };
  }

  async updateRecipe(data: UpdateRecipe) {
    const { id, ingredients, ...recipeData } = data;

    return await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany({ where: { recipeId: id } });

      return await tx.recipe.update({
        where: { id },
        data: {
          ...recipeData,
          instructions: recipeData.instructions
            ? JSON.stringify(recipeData.instructions)
            : undefined,
          ingredients: ingredients ? { create: ingredients } : undefined,
        },
        include: { ingredients: true },
      });
    });
  }

  async deleteRecipe(id: string) {
    return await prisma.recipe.delete({ where: { id } });
  }
}

export const recipeService = new RecipeService();
```

## � セットアップ

### 必要なパッケージ

```bash
npm install @prisma/client zod
npm install -D prisma
```

### 環境設定

```bash
# .env
DATABASE_URL="file:./dev.db"
```

### 初期化コマンド

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 🗄️ MVP データ構造

### 1. Recipe（レシピ）テーブル

#### TypeScript 型定義

```typescript
interface Recipe {
  id: string; // UUID v4
  title: string; // レシピ名（必須、1-100文字）
  description?: string; // 説明（任意、0-500文字）
  cookingTimeMinutes: number; // 調理時間（分）
  servings: number; // 人分（デフォルト: 2）
  instructions: string[]; // 手順配列
  ingredients: Ingredient[]; // 材料配列（embedded）
  createdAt: string; // 作成日時（ISO 8601）
  updatedAt: string; // 更新日時（ISO 8601）
}
```

#### フィールド詳細

| フィールド         | 型             | 制約                  | デフォルト               | 説明           |
| ------------------ | -------------- | --------------------- | ------------------------ | -------------- |
| id                 | string         | PRIMARY KEY, NOT NULL | UUID v4                  | 一意識別子     |
| title              | string         | NOT NULL, 1-100 文字  | -                        | レシピ名       |
| description        | string \| null | 0-500 文字            | null                     | 説明・コメント |
| cookingTimeMinutes | number         | NOT NULL, >= 1        | -                        | 調理時間（分） |
| servings           | number         | NOT NULL, >= 1        | 2                        | 何人分         |
| instructions       | string[]       | NOT NULL, >= 1 要素   | []                       | 手順リスト     |
| ingredients        | Ingredient[]   | NOT NULL, >= 1 要素   | []                       | 材料リスト     |
| createdAt          | string         | NOT NULL              | new Date().toISOString() | 作成日時       |
| updatedAt          | string         | NOT NULL              | new Date().toISOString() | 更新日時       |

### 2. Ingredient（材料）エンベデッド構造

#### TypeScript 型定義

```typescript
interface Ingredient {
  name: string; // 材料名（必須、1-50文字）
  amount: string; // 分量（必須、1-20文字）
  unit: string; // 単位（必須、1-10文字）
}
```

#### フィールド詳細

| フィールド | 型     | 制約                | 説明                       | 例                         |
| ---------- | ------ | ------------------- | -------------------------- | -------------------------- |
| name       | string | NOT NULL, 1-50 文字 | 材料名                     | "玉ねぎ", "醤油"           |
| amount     | string | NOT NULL, 1-20 文字 | 分量（文字列で柔軟性確保） | "2 個", "大さじ 1", "適量" |
| unit       | string | NOT NULL, 1-10 文字 | 単位                       | "個", "g", "ml", "カップ"  |

---

## 📊 データ例

### レシピデータサンプル

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "チャーハン",
  "description": "シンプルで美味しい基本のチャーハンです",
  "cookingTimeMinutes": 15,
  "servings": 2,
  "instructions": [
    "ご飯を炒める前に卵を溶いておく",
    "フライパンに油を熱し、卵を入れて半熟状態で一度取り出す",
    "同じフライパンでご飯を炒める",
    "卵を戻し入れ、調味料を加えて混ぜ合わせる",
    "ねぎを加えてサッと炒めて完成"
  ],
  "ingredients": [
    {
      "name": "ご飯",
      "amount": "300",
      "unit": "g"
    },
    {
      "name": "卵",
      "amount": "2",
      "unit": "個"
    },
    {
      "name": "長ねぎ",
      "amount": "1/2",
      "unit": "本"
    },
    {
      "name": "醤油",
      "amount": "大さじ1",
      "unit": ""
    },
    {
      "name": "塩コショウ",
      "amount": "少々",
      "unit": ""
    },
    {
      "name": "サラダ油",
      "amount": "大さじ1",
      "unit": ""
    }
  ],
  "createdAt": "2025-07-30T10:00:00.000Z",
  "updatedAt": "2025-07-30T10:00:00.000Z"
}
```

---

## 🔍 検索・インデックス戦略

### MVP 段階（ローカルストレージ）

```typescript
// メモリ内検索関数
function searchRecipes(recipes: Recipe[], query: string): Recipe[] {
  const normalizedQuery = query.toLowerCase().trim();

  return recipes.filter(
    (recipe) =>
      // タイトル検索
      recipe.title.toLowerCase().includes(normalizedQuery) ||
      // 説明検索
      recipe.description?.toLowerCase().includes(normalizedQuery) ||
      // 材料名検索
      recipe.ingredients.some((ingredient) =>
        ingredient.name.toLowerCase().includes(normalizedQuery)
      )
  );
}
```

### 将来の DB 実装時のインデックス

```sql
-- PostgreSQL想定
CREATE INDEX idx_recipes_title ON recipes USING gin(to_tsvector('japanese', title));
CREATE INDEX idx_recipes_description ON recipes USING gin(to_tsvector('japanese', description));
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time_minutes);
```

---

## 💾 データ永続化実装

### ローカルストレージ操作クラス

```typescript
class RecipeStorage {
  private readonly STORAGE_KEY = "recipe-app-data";

  // 全レシピ取得
  getAllRecipes(): Recipe[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // レシピ保存
  saveRecipe(recipe: Recipe): void {
    const recipes = this.getAllRecipes();
    const existingIndex = recipes.findIndex((r) => r.id === recipe.id);

    if (existingIndex >= 0) {
      // 更新
      recipes[existingIndex] = {
        ...recipe,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // 新規作成
      recipes.push(recipe);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
  }

  // レシピ削除
  deleteRecipe(id: string): boolean {
    const recipes = this.getAllRecipes();
    const filteredRecipes = recipes.filter((r) => r.id !== id);

    if (filteredRecipes.length === recipes.length) {
      return false; // 削除対象が見つからない
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredRecipes));
    return true;
  }

  // ID指定取得
  getRecipeById(id: string): Recipe | null {
    const recipes = this.getAllRecipes();
    return recipes.find((r) => r.id === id) || null;
  }

  // データバックアップ
  exportData(): string {
    return localStorage.getItem(this.STORAGE_KEY) || "[]";
  }

  // データ復元
  importData(jsonData: string): void {
    try {
      const recipes = JSON.parse(jsonData) as Recipe[];
      // バリデーション実行
      this.validateRecipes(recipes);
      localStorage.setItem(this.STORAGE_KEY, jsonData);
    } catch (error) {
      throw new Error("無効なデータ形式です");
    }
  }

  private validateRecipes(recipes: Recipe[]): void {
    recipes.forEach((recipe) => {
      if (
        !recipe.id ||
        !recipe.title ||
        !recipe.instructions.length ||
        !recipe.ingredients.length
      ) {
        throw new Error("必須フィールドが不足しています");
      }
    });
  }
}
```

---

## 🔧 バリデーション仕様

### 入力バリデーション

```typescript
interface RecipeValidationRules {
  title: {
    required: true;
    minLength: 1;
    maxLength: 100;
  };
  description: {
    required: false;
    maxLength: 500;
  };
  cookingTimeMinutes: {
    required: true;
    min: 1;
    max: 1440; // 24時間
  };
  servings: {
    required: true;
    min: 1;
    max: 20;
  };
  instructions: {
    required: true;
    minItems: 1;
    maxItems: 50;
    itemMaxLength: 200;
  };
  ingredients: {
    required: true;
    minItems: 1;
    maxItems: 50;
    itemValidation: {
      name: { required: true; maxLength: 50 };
      amount: { required: true; maxLength: 20 };
      unit: { required: true; maxLength: 10 };
    };
  };
}
```

---

## 🚀 マイグレーション計画

### Phase 2 移行時のデータ拡張

```typescript
// 将来追加される可能性のあるフィールド
interface ExtendedRecipe extends Recipe {
  // Phase 2A追加予定
  categories?: string[]; // カテゴリ
  tags?: string[]; // タグ
  images?: string[]; // 画像URL
  difficulty?: "easy" | "medium" | "hard"; // 難易度

  // Phase 2B追加予定
  isFavorite?: boolean; // お気に入り
  rating?: number; // 評価（1-5）
  notes?: string; // 個人メモ
  timesCooked?: number; // 作った回数

  // Phase 3A追加予定
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}
```

### データ移行戦略

```typescript
// バージョン管理
interface StorageMetadata {
  version: string;
  lastMigration: string;
  recipeCount: number;
}

class DataMigration {
  migrateToV2(v1Data: Recipe[]): ExtendedRecipe[] {
    return v1Data.map((recipe) => ({
      ...recipe,
      categories: [],
      tags: [],
      images: [],
      isFavorite: false,
      rating: 0,
      timesCooked: 0,
    }));
  }
}
```

---

## 📏 容量・パフォーマンス考慮

### MVP 段階の想定

- **レシピ数**: 最大 500 件
- **平均レシピサイズ**: 2-3KB
- **総データサイズ**: 約 1.5MB 以下
- **ローカルストレージ制限**: 5-10MB（ブラウザ依存）

### パフォーマンス最適化

```typescript
// 大量データ対応の検索最適化
class OptimizedSearch {
  private searchIndex: Map<string, Set<string>> = new Map();

  // インデックス構築
  buildSearchIndex(recipes: Recipe[]): void {
    this.searchIndex.clear();

    recipes.forEach((recipe) => {
      const words = [
        ...recipe.title.toLowerCase().split(/\s+/),
        ...(recipe.description?.toLowerCase().split(/\s+/) || []),
        ...recipe.ingredients.map((ing) => ing.name.toLowerCase()),
      ];

      words.forEach((word) => {
        if (!this.searchIndex.has(word)) {
          this.searchIndex.set(word, new Set());
        }
        this.searchIndex.get(word)!.add(recipe.id);
      });
    });
  }

  // 高速検索
  search(query: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const results = words.map(
      (word) => this.searchIndex.get(word) || new Set<string>()
    );

    // AND検索（全ワードを含む）
    return Array.from(
      results.reduce(
        (acc, curr) => new Set([...acc].filter((x) => curr.has(x)))
      )
    );
  }
}
```

この設計書により、MVP 段階でシンプルかつ実用的なデータ管理が可能になり、将来の機能拡張にも対応できる基盤が整います。
