import { z } from "zod";

export const IngredientSchema = z.object({
  name: z.string().min(1, "材料名は必須です").max(50),
  amount: z.string().min(1, "分量は必須です").max(20),
  unit: z.string().max(10).optional(),
});
