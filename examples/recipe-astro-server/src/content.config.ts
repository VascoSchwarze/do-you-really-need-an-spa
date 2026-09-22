import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const recipes = defineCollection({
	loader: glob({ pattern: "**/*.yaml", base: "./src/content/recipes" }),
	schema: z.object({
		title: z.object({
			de: z.string(),
			en: z.string(),
		}),
		description: z.object({
			de: z.string(),
			en: z.string(),
		}),
		category: z.enum(["Vegetarisch", "Fleisch", "Dessert", "Vegan"]),
		cookTime: z.number().positive(),
		difficulty: z.number().int().min(1).max(5),
		servings: z.number().int().positive(),
		featured: z.boolean().default(false),
		image: z.string(),
		ingredients: z.array(
			z.object({
				name: z.string(),
				amount: z.number().positive(),
				unit: z.string(),
			}),
		),
		steps: z.array(z.string()),
	}),
});

export const collections = { recipes };
