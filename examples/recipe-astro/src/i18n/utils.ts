import { ui, defaultLang, type Lang } from "./ui";

export function getLangFromUrl(url: URL): Lang {
	const [, lang] = url.pathname.split("/");
	if (lang && lang in ui) return lang as Lang;
	return defaultLang;
}

export function useTranslations(lang: Lang) {
	return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
		return ui[lang][key] ?? ui[defaultLang][key];
	};
}

const recipesPath: Record<Lang, string> = { de: "rezepte", en: "recipes" };
const aboutPath: Record<Lang, string> = { de: "ueber-uns", en: "about" };

export function localizedPath(lang: Lang, page: "home" | "recipes" | "about", slug?: string): string {
	if (page === "home") return `/${lang}/`;
	if (page === "about") return `/${lang}/${aboutPath[lang]}/`;
	if (page === "recipes") {
		return slug ? `/${lang}/${recipesPath[lang]}/${slug}/` : `/${lang}/${recipesPath[lang]}/`;
	}
	return `/${lang}/`;
}
