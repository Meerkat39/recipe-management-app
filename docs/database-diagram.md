# レシピ管理アプリケーション - RDB設計図

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

## 🔗 リレーション詳細

### Recipe → Ingredient (1:N)
- **関係性**: 1つのレシピは複数の材料を持つ
- **外部キー**: `Ingredient.recipeId` → `Recipe.id`
- **削除制約**: `onDelete: Cascade` (レシピ削除時に関連材料も削除)

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

## 🎯 データ例

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

## 🔍 主要なクエリパターン

### 1. レシピ一覧取得（材料付き）
```sql
SELECT 
  r.id, r.title, r.description, r.cookingTimeMinutes, r.servings,
  i.name as ingredient_name, i.amount, i.unit
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
ORDER BY r.updatedAt DESC;
```

### 2. レシピ検索（タイトル・材料名）
```sql
SELECT DISTINCT r.*
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
WHERE r.title LIKE '%チャーハン%' 
   OR r.description LIKE '%チャーハン%'
   OR i.name LIKE '%チャーハン%';
```

### 3. レシピ詳細取得
```sql
SELECT 
  r.*, 
  json_group_array(
    json_object(
      'id', i.id,
      'name', i.name,
      'amount', i.amount,
      'unit', i.unit
    )
  ) as ingredients
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipeId
WHERE r.id = 'clv123abc'
GROUP BY r.id;
```

## 📏 インデックス設計

### 推奨インデックス
```sql
-- recipes テーブル
CREATE INDEX idx_recipes_title ON recipes(title);
CREATE INDEX idx_recipes_updated_at ON recipes(updatedAt DESC);
CREATE INDEX idx_recipes_cooking_time ON recipes(cookingTimeMinutes);

-- ingredients テーブル
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipeId);
CREATE INDEX idx_ingredients_name ON ingredients(name);

-- 複合インデックス
CREATE INDEX idx_ingredients_recipe_name ON ingredients(recipeId, name);
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

この設計により、シンプルで効率的なレシピ管理システムの基盤が構築できます。
