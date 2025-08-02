"use server";

import prisma from "@/lib/prisma";
import { CreateRecipeSchema } from "@/schemas/recipe";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

export async function createRecipeAction(formData: FormData) {
  try {
    let parsedIngredients = JSON.parse(formData.get("ingredients") as string);
    // unitがundefinedの場合は空文字に変換
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

    const validatedData = CreateRecipeSchema.parse(rawData);

    const recipe = await prisma.recipe.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        cookingTimeMinutes: validatedData.cookingTimeMinutes,
        servings: validatedData.servings,
        instructions: JSON.stringify(validatedData.instructions),
        ingredients: {
          create: validatedData.ingredients.map((ing) => ({
            name: ing.name,
            amount: ing.amount,
            unit: ing.unit ?? "",
          })),
        },
      },
    });

    revalidatePath("/recipes");
    redirect(`/recipes/${recipe.id}`);
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: "バリデーションエラー", details: error.issues };
    }
    return { error: "レシピの作成に失敗しました" };
  }
}

// 必要に応じて updateRecipeAction, deleteRecipeAction も追加可能
