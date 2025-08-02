import { RecipesList } from "@/components/RecipesList";
import prisma from "@/lib/prisma";
import type { Recipe } from "@/types/recipe";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    include: { ingredients: true },
    orderBy: { createdAt: "desc" },
  });
  // createdAt を文字列化して渡す
  const recipesForClient: (Omit<Recipe, "createdAt"> & {
    createdAt: string;
  })[] = recipes.map((r) => ({
    ...r,
    createdAt: r.createdAt.toLocaleDateString(),
  }));
  return <RecipesList recipes={recipesForClient} />;
}
