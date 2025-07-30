-- CreateTable
CREATE TABLE "recipes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "cookingTimeMinutes" INTEGER NOT NULL,
    "servings" INTEGER NOT NULL DEFAULT 2,
    "instructions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    CONSTRAINT "ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
