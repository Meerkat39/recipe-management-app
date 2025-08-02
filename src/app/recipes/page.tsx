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
    },
    {
      id: 2,
      title: "ハンバーグステーキ",
      description: "ジューシーなハンバーグとデミグラスソース。",
      time: "30分",
      servings: "2人分",
      date: "2025/07/20",
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">レシピ一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id}>
              <div className="flex flex-col gap-2">
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
          ))}
        </div>
      </div>
    </Layout>
  );
}
