export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
}

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  category: string;
  cookTime: number;
  difficulty: number;
  servings: number;
  featured: boolean;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
}
