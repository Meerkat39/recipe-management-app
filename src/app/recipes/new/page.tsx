import prisma from "@/lib/prisma";
import { CreateRecipeSchema } from "@/schemas/recipe";
import { redirect } from "next/navigation";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Layout } from "../../../components/ui/Layout";

async function createRecipe(formData: FormData): Promise<void> {
  "use server";
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const cookingTimeMinutes = formData.get("cookingTimeMinutes") as string;
  const servings = formData.get("servings") as string;
  const ingredients = formData.get("ingredients") as string;
  const instructions = formData.get("instructions") as string;
  const result = CreateRecipeSchema.safeParse({
    title,
    description,
    cookingTimeMinutes,
    servings,
    ingredients,
    instructions,
  });
  if (!result.success) {
    // TODO: エラー表示処理
    return;
  }
  try {
    await prisma.recipe.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        cookingTimeMinutes: result.data.cookingTimeMinutes,
        servings: result.data.servings,
        ingredients: {
          create: result.data.ingredients.map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit ?? "",
          })),
        },
        instructions: JSON.stringify(result.data.instructions),
      },
    });
    redirect("/recipes");
  } catch {
    // TODO: エラー表示処理
    return;
  }
}

export default function NewRecipePage() {
  return (
    <Layout>
      <div className="max-w-xl mx-auto p-6">
        <Card>
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            新規レシピ作成
          </h2>
          <form action={createRecipe} className="space-y-4">
            <Input
              label="タイトル"
              name="title"
              required
              className="text-gray-900"
            />
            <Input label="説明" name="description" className="text-gray-900" />
            <Input
              label="調理時間（分）"
              name="cookingTimeMinutes"
              type="number"
              required
              className="text-gray-900"
            />
            <Input
              label="人数"
              name="servings"
              type="number"
              required
              className="text-gray-900"
            />
            <Input
              label="材料（JSON配列）"
              name="ingredients"
              required
              className="text-gray-900"
            />
            <Input
              label="手順（JSON配列）"
              name="instructions"
              required
              className="text-gray-900"
            />
            <Button type="submit">作成</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
