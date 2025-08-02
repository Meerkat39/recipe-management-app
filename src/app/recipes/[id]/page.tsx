import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Layout } from "@/components/ui/Layout";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
// レシピ削除用サーバーアクション
export async function deleteRecipe(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.recipe.delete({ where: { id } });
  redirect("/recipes");
}

interface RecipeDetailPageProps {
  params: { id: string };
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    include: { ingredients: true },
  });
  if (!recipe) {
    return <div>レシピが見つかりませんでした。</div>;
  }
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {recipe.title}
          </h1>
          <div className="text-sm text-gray-500 flex gap-4 mb-2">
            <span>⏱️ {recipe.cookingTimeMinutes}分</span>
            <span>👥 {recipe.servings}人分</span>
            <span>📅 {recipe.createdAt.toLocaleDateString()}</span>
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
                <span className="text-gray-700">
                  {ing.amount} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mt-6 mb-2 text-indigo-700">
            手順
          </h2>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            {JSON.parse(recipe.instructions).map(
              (step: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700">
                  {step}
                </li>
              )
            )}
          </ol>
          <div className="flex gap-2 mt-4">
            <Link href={`/recipes/${recipe.id}/edit`}>
              <Button variant="secondary">編集</Button>
            </Link>
            <form action={deleteRecipe}>
              <input type="hidden" name="id" value={recipe.id} />
              <Button variant="danger" type="submit">
                削除
              </Button>
            </form>
            <Link href="/recipes">
              <Button variant="primary">一覧へ戻る</Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
