import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "static",
	i18n: {
		defaultLocale: "de",
		locales: ["de", "en"],
		routing: {
			prefixDefaultLocale: true,
			redirectToDefaultLocale: true,
		},
	},
	server: {
		port: 5175,
	},
});
