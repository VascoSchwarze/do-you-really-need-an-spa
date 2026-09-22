// In-memory demo store shared by the server island, the rating action, and the stats page.

type RatingEntry = { sum: number; count: number };

const viewCounts = new Map<string, number>();
const ratings = new Map<string, RatingEntry>();
let lastRatedSlug: string | null = null;
let lastRatedAt: Date | null = null;

export function recordView(slug: string): number {
	const next = (viewCounts.get(slug) ?? 0) + 1;
	viewCounts.set(slug, next);
	return next;
}

export function getViewCount(slug: string): number {
	return viewCounts.get(slug) ?? 0;
}

export function rankByViews<T extends { slug: string }>(items: T[]): (T & { views: number })[] {
	return items
		.map((item) => ({ ...item, views: getViewCount(item.slug) }))
		.sort((a, b) => b.views - a.views);
}

export function addRating(slug: string, value: number): RatingEntry {
	const current = ratings.get(slug) ?? { sum: 0, count: 0 };
	const next = { sum: current.sum + value, count: current.count + 1 };
	ratings.set(slug, next);
	lastRatedSlug = slug;
	lastRatedAt = new Date();
	return next;
}

export function getRating(slug: string): { average: number; count: number } {
	const entry = ratings.get(slug);
	if (!entry || entry.count === 0) return { average: 0, count: 0 };
	return { average: entry.sum / entry.count, count: entry.count };
}

export function getGlobalStats() {
	const totalViews = [...viewCounts.values()].reduce((sum, v) => sum + v, 0);
	const totalRatings = [...ratings.values()].reduce((sum, r) => sum + r.count, 0);
	return {
		totalViews,
		viewedRecipes: viewCounts.size,
		ratedRecipes: ratings.size,
		totalRatings,
		lastRatedSlug,
		lastRatedAt,
	};
}
