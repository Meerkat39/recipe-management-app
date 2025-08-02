import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/Input";
import { Layout } from "../../../../components/ui/Layout";

// レシピ編集サーバーアクション
async function updateRecipe(id: string, formData: FormData): Promise<void> {
  "use server";
  // TODO: バリデーション・エラーハンドリング
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cookingTimeMinutes = Number(formData.get("cookingTimeMinutes"));
  const servings = Number(formData.get("servings"));
  // TODO: 材料・手順のパース
  await prisma.recipe.update({
    where: { id },
    data: {
      title,
      description,
      cookingTimeMinutes,
      servings,
      // TODO: 材料・手順の更新
    },
  });
  redirect(`/recipes/${id}`);
}

// レシピデータ取得
async function getRecipe(id: string) {
  return await prisma.recipe.findUnique({
    where: { id },
    include: { ingredients: true },
  });
}

export default async function EditRecipePage({
  params,
}: {
  params: { id: string };
}) {
  const recipe = await getRecipe(params.id);
  if (!recipe) return <div>レシピが見つかりません</div>;
  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            レシピ編集
          </h2>
          <form
            action={updateRecipe.bind(null, params.id)}
            className="space-y-4"
          >
            <Input
              label="タイトル"
              name="title"
              required
              defaultValue={recipe.title ?? ""}
              className="text-gray-900"
            />
            <Input
              label="説明"
              name="description"
              defaultValue={recipe.description ?? ""}
              className="text-gray-900"
            />
            <Input
              label="調理時間（分）"
              name="cookingTimeMinutes"
              type="number"
              required
              defaultValue={recipe.cookingTimeMinutes ?? 0}
              className="text-gray-900"
            />
            <Input
              label="人数"
              name="servings"
              type="number"
              required
              defaultValue={recipe.servings ?? 0}
              className="text-gray-900"
            />
            {/* TODO: 材料・手順の編集UI */}
            <Button type="submit">保存</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
