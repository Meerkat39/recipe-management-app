"use client";
import React from "react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Layout } from "../../components/ui/Layout";

export default function RecipesPage() {
  // 仮データ
  const recipes = [
    {
      id: 1,
      title: "チキンカレー",
      description: "スパイスの効いた本格的なチキンカレー。",
      time: "45分",
      servings: "4人分",
      date: "2025/07/25",
      ingredients: ["鶏肉", "玉ねぎ", "カレー粉", "トマト"],
    },
    {
      id: 2,
      title: "ハンバーグステーキ",
      description: "ジューシーなハンバーグとデミグラスソース。",
      time: "30分",
      servings: "2人分",
      date: "2025/07/20",
      ingredients: ["牛肉", "玉ねぎ", "パン粉", "卵"],
    },
  ];

  // 検索バー用state
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
          r.ingredients.some((ing) => ing.includes(kw))
        );
      } else {
        ingredientMatch = ingredientKeywords.some((kw) =>
          r.ingredients.some((ing) => ing.includes(kw))
        );
      }
    }
    return titleMatch && ingredientMatch;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">レシピ一覧</h1>
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
                    材料: {recipe.ingredients.join(", ")}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {recipe.title}
                  </div>
                  <div className="text-sm text-gray-500 flex gap-4">
                    <span>⏱️ {recipe.time}</span>
                    <span>👥 {recipe.servings}</span>
                    <span>📅 {recipe.date}</span>
                  </div>
                  <div className="text-gray-700 text-sm mb-2">
                    {recipe.description}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="primary">詳細</Button>
                    <Button variant="secondary">編集</Button>
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
