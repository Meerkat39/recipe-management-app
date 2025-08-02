"use server";

import prisma from "@/lib/prisma";
import { CreateRecipeSchema } from "@/schemas/recipe";
import { redirect } from "next/navigation";
import { ZodIssue } from "zod";

export async function createRecipeAction(formData: FormData) {
  try {
    let parsedIngredients = JSON.parse(formData.get("ingredients") as string);
    parsedIngredients = parsedIngredients.map(
      (ing: { name: string; amount: string; unit?: string }) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit ?? "",
      })
    );
    const parsedInstructions = JSON.parse(
      formData.get("instructions") as string
    );
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      cookingTimeMinutes: Number(formData.get("cookingTimeMinutes")),
      servings: Number(formData.get("servings")),
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
    };

    const result = CreateRecipeSchema.safeParse(rawData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue: ZodIssue) => {
        if (issue.path.length > 0 && typeof issue.path[0] === "string") {
          errors[issue.path[0]] = issue.message;
        }
      });
      return {
        error: "バリデーションエラー",
        details: result.error.issues,
        fieldErrors: errors,
      };
    }

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
    return { error: "レシピの作成に失敗しました" };
  }
}
