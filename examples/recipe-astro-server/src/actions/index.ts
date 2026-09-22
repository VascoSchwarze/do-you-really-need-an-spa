import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { addRating, getRating } from "../server/recipe-stats";

export const server = {
	rateRecipe: defineAction({
		accept: "form",
		input: z.object({
			slug: z.string(),
			rating: z.coerce.number().int().min(1).max(5),
		}),
		handler: async ({ slug, rating }) => {
			addRating(slug, rating);
			return getRating(slug);
		},
	}),
};
