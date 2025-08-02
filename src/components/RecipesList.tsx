"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Layout } from "@/components/ui/Layout";
import type { Ingredient, Recipe } from "@/types/recipe";
import Link from "next/link";
import React from "react";

export type RecipesListProps = {
  recipes: (Omit<Recipe, "createdAt"> & { createdAt: string })[];
};

export function RecipesList({ recipes }: RecipesListProps) {
  const [searchTitle, setSearchTitle] = React.useState("");
  const [searchIngredient, setSearchIngredient] = React.useState("");
  const [searchMode, setSearchMode] = React.useState<"AND" | "OR">("OR");
  const ingredientKeywords = searchIngredient
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const filteredRecipes = recipes.filter((r) => {
    const titleMatch = r.title
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    let ingredientMatch = true;
    if (ingredientKeywords.length > 0) {
      if (searchMode === "AND") {
        ingredientMatch = ingredientKeywords.every((kw) =>
          r.ingredients.some((ing) => ing.name.includes(kw))
        );
      } else {
        ingredientMatch = ingredientKeywords.some((kw) =>
          r.ingredients.some((ing) => ing.name.includes(kw))
        );
      }
    }
    return titleMatch && ingredientMatch;
  });
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">レシピ一覧</h1>
          <Link href="/recipes/new">
            <Button variant="primary">新規作成</Button>
          </Link>
        </div>
        <div className="mb-6 flex flex-col gap-2 max-w-md">
          <div className="text-sm text-gray-600 mt-1">
            検索結果: {filteredRecipes.length} 件
          </div>
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="レシピ名で検索"
            className="border rounded px-3 py-2 w-full text-gray-900"
          />
          <input
            type="text"
            value={searchIngredient}
            onChange={(e) => setSearchIngredient(e.target.value)}
            placeholder="材料名で検索"
            className="border rounded px-3 py-2 w-full text-gray-900"
          />
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant={searchMode === "AND" ? "primary" : "secondary"}
              onClick={() => setSearchMode("AND")}
            >
              AND検索
            </Button>
            <Button
              type="button"
              variant={searchMode === "OR" ? "primary" : "secondary"}
              onClick={() => setSearchMode("OR")}
            >
              OR検索
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchTitle("");
                setSearchIngredient("");
              }}
            >
              検索クリア
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              該当するレシピはありません
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <Card key={recipe.id}>
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-500 mb-1">
                    材料:{" "}
                    {recipe.ingredients
                      .map((ing: Ingredient) => ing.name)
                      .join(", ")}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {recipe.title}
                  </div>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>⏱️ {recipe.cookingTimeMinutes}分</span>
                    <span>👥 {recipe.servings}人分</span>
                    <span>📅 {recipe.createdAt}</span>
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    {recipe.description}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link href={`/recipes/${recipe.id}`}>
                      <Button variant="primary">詳細</Button>
                    </Link>
                    <Link href={`/recipes/${recipe.id}/edit`}>
                      <Button variant="secondary">編集</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
