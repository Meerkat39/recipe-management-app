import { z } from "zod";
import { IngredientSchema } from "./ingredient";

export const CreateRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(50, "タイトルは50文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .or(z.literal("")),
  cookingTimeMinutes: z.coerce.number().int().min(1, "調理時間は必須です"),
  servings: z.coerce.number().int().min(1, "人数は必須です"),
  ingredients: z.array(IngredientSchema).min(1, "材料は必須です"),
  instructions: z.array(z.string().min(1)).min(1, "手順は必須です"),
});
