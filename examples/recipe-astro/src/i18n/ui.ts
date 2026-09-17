export const defaultLang = "de";

export const ui = {
	de: {
		"nav.home": "Start",
		"nav.recipes": "Rezepte",
		"nav.about": "Über uns",
		brand: "Rezeptbuch",
		"home.title": "Kochen ohne Kompromisse",
		"home.subtitle":
			"Eine Vielzahl durchdachter Rezepte, live berechnete Portionen und ein Kochmodus, der dich Schritt für Schritt begleitet.",
		"home.cta": "Alle Rezepte entdecken",
		"home.featured": "Ausgewählte Rezepte",
		"recipes.title": "Alle Rezepte",
		"recipes.search.placeholder": "Rezept suchen…",
		"recipes.filter.all": "Alle",
		"recipes.count.one": "Rezept",
		"recipes.count.many": "Rezepte",
		"recipes.empty": "Keine Rezepte gefunden.",
		"recipe.back": "← Zurück zur Übersicht",
		"recipe.ingredients": "Zutaten",
		"recipe.servings": "Portionen",
		"recipe.steps": "Kochmodus",
		"recipe.steps.hint": "Hake Schritte ab, während du kochst.",
		"recipe.minutes": "Min.",
		"favorite.add": "zu Favoriten hinzufügen",
		"favorite.remove": "von Favoriten entfernen",
		"category.Vegetarisch": "Vegetarisch",
		"category.Fleisch": "Fleisch",
		"category.Dessert": "Dessert",
		"category.Vegan": "Vegan",
		"about.title": "Über uns",
		"about.p1":
			"Rezeptbuch ist ein Demo-Projekt, das im Rahmen eines Konferenzvortrags entstanden ist. Es vergleicht zwei technische Ansätze für dieselbe kleine Rezepte-App: eine klassische React Single Page Application und diese Astro-App mit Islands-Architektur.",
		"about.p2":
			"Beide Varianten bieten identische Inhalte und Funktionen: Rezeptsuche, Portionsrechner, Favoriten und einen Kochmodus. Der Unterschied liegt ausschließlich darin, wie viel JavaScript zum Anzeigen und Bedienen der Seite notwendig ist.",
	},
	en: {
		"nav.home": "Home",
		"nav.recipes": "Recipes",
		"nav.about": "About",
		brand: "Recipe Book",
		"home.title": "Cooking without compromise",
		"home.subtitle":
			"Eight thoughtful recipes, live portion scaling, and a cook mode that guides you step by step.",
		"home.cta": "Discover all recipes",
		"home.featured": "Featured recipes",
		"recipes.title": "All recipes",
		"recipes.search.placeholder": "Search recipes…",
		"recipes.filter.all": "All",
		"recipes.count.one": "recipe",
		"recipes.count.many": "recipes",
		"recipes.empty": "No recipes found.",
		"recipe.back": "← Back to overview",
		"recipe.ingredients": "Ingredients",
		"recipe.servings": "Servings",
		"recipe.steps": "Cook mode",
		"recipe.steps.hint": "Check off steps as you cook.",
		"recipe.minutes": "min",
		"favorite.add": "add to favorites",
		"favorite.remove": "remove from favorites",
		"category.Vegetarisch": "Vegetarian",
		"category.Fleisch": "Meat",
		"category.Dessert": "Dessert",
		"category.Vegan": "Vegan",
		"about.title": "About us",
		"about.p1":
			"Recipe Book is a demo project built for a conference talk. It compares two technical approaches to the same small recipe app: a classic React single page application and this Astro app with an islands architecture.",
		"about.p2":
			"Both versions offer identical content and features: recipe search, a portion calculator, favorites, and a cook mode. The only difference is how much JavaScript is required to display and operate the page.",
	},
} as const;

export type Lang = keyof typeof ui;
