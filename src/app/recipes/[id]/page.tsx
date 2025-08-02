import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Layout } from "../../../components/ui/Layout";

// 仮データ（本来はDBから取得）
const recipe = {
  id: 1,
  title: "チキンカレー",
  description:
    "スパイスの効いた本格的なチキンカレー。家族みんなが大好きな一品です。",
  time: "45分",
  servings: "4人分",
  date: "2025/07/25",
  ingredients: [
    { name: "鶏もも肉", amount: "400g" },
    { name: "玉ねぎ", amount: "2個（中サイズ）" },
    { name: "カレールー", amount: "1箱（8皿分）" },
    { name: "水", amount: "600ml" },
    { name: "サラダ油", amount: "大さじ2" },
    { name: "にんじん", amount: "1本" },
  ],
  steps: [
    "鶏肉と野菜を一口大に切る。",
    "鍋に油を熱し、玉ねぎを炒める。",
    "鶏肉・にんじんを加えて炒める。",
    "水を加えて煮込む。",
    "カレールーを加えてさらに煮込む。",
    "器に盛り付けて完成。",
  ],
};

export default function RecipeDetailPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {recipe.title}
          </h1>
          <div className="text-sm text-gray-500 flex gap-4 mb-2">
            <span>⏱️ {recipe.time}</span>
            <span>👥 {recipe.servings}</span>
            <span>📅 {recipe.date}</span>
          </div>
          <p className="text-gray-700 mb-4">{recipe.description}</p>
          <h2 className="text-lg font-semibold mt-6 mb-2 text-indigo-700">
            材料
          </h2>
          <ul className="mb-4">
            {recipe.ingredients.map((ing, idx) => (
              <li
                key={idx}
                className="flex justify-between text-sm py-1 border-b border-gray-100"
              >
                <span className="text-gray-900 font-medium">{ing.name}</span>
                <span className="text-gray-700">{ing.amount}</span>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-6 mb-2 text-indigo-700">
            手順
          </h2>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {recipe.steps.map((step, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                {step}
              </li>
            ))}
          </ol>
          <div className="flex gap-2 mt-4">
            <Button variant="secondary">編集</Button>
            <Button variant="danger">削除</Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
