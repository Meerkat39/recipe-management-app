export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  recipeId: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  cookingTimeMinutes: number;
  servings: number;
  instructions: string;
  ingredients: Ingredient[];
  createdAt: Date;
  updatedAt: Date;
}
