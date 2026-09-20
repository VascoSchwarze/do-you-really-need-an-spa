// highlight.js language definition for .astro files.
// https://highlightjs.readthedocs.io/en/latest/language-guide.html
//
// An .astro file is HTML-like markup with two Astro-specific extensions:
//   1. an optional TS/JS "frontmatter" block fenced by `---` at the very top
//   2. `{...}` expressions embedded in tag content/attributes, evaluated as JS
// Everything else (tags, comments, <script>/<style>) behaves like HTML.
export default function astro(hljs) {
	const regex = hljs.regex;

	const TAG_NAME_RE = regex.concat(
		/[A-Za-z_][A-Za-z0-9_.-]*/,
		regex.optional(/:[A-Za-z_][A-Za-z0-9_.-]*/),
	);

	// `{expr}` — recurses via "self" so nested braces (objects, arrow fns, …) stay balanced.
	const EXPRESSION = {
		className: "subst",
		begin: /\{/,
		end: /\}/,
		excludeBegin: true,
		excludeEnd: true,
		subLanguage: "javascript",
		contains: ["self"],
	};

	const ATTRIBUTE_VALUE = {
		className: "string",
		variants: [{ begin: /"/, end: /"/ }, { begin: /'/, end: /'/ }],
	};

	const ATTRIBUTE = {
		className: "attr",
		begin: regex.concat(/[A-Za-z_][A-Za-z0-9_-]*/, regex.optional(/:[A-Za-z0-9_-]+/)),
		relevance: 0,
	};

	const TAG_INTERIOR = {
		endsWithParent: true,
		illegal: /</,
		relevance: 0,
		contains: [
			ATTRIBUTE,
			{
				begin: /=/,
				relevance: 0,
				contains: [ATTRIBUTE_VALUE, EXPRESSION],
			},
		],
	};

	const OPEN_TAG = {
		className: "tag",
		begin: regex.concat(
			/</,
			regex.lookahead(regex.concat(TAG_NAME_RE, regex.either(/\/>/, />/, /\s/))),
		),
		end: /\/?>/,
		contains: [{ className: "name", begin: TAG_NAME_RE, relevance: 0, starts: TAG_INTERIOR }],
	};

	const CLOSE_TAG = {
		className: "tag",
		begin: regex.concat(/<\//, regex.lookahead(regex.concat(TAG_NAME_RE, />/))),
		contains: [
			{ className: "name", begin: TAG_NAME_RE, relevance: 0 },
			{ begin: />/, relevance: 0, endsParent: true },
		],
	};

	const FRAGMENT_TAG = {
		className: "tag",
		begin: /<>|<\/>/,
	};

	const STYLE_TAG = {
		className: "tag",
		begin: /<style(?=\s|>)/,
		end: />/,
		contains: [TAG_INTERIOR],
		starts: {
			end: /<\/style>/,
			returnEnd: true,
			subLanguage: "css",
		},
	};

	const SCRIPT_TAG = {
		className: "tag",
		begin: /<script(?=\s|>)/,
		end: />/,
		contains: [TAG_INTERIOR],
		starts: {
			end: /<\/script>/,
			returnEnd: true,
			subLanguage: "javascript",
		},
	};

	// Only meaningful as the first thing in the file; `^`/`$` are line-anchored
	// by highlight.js (it always compiles with the "m" flag), so this also
	// matches a lone "---" line further down — acceptable for real Astro files,
	// where that only happens inside the frontmatter fence itself.
	const FRONTMATTER = {
		className: "meta",
		begin: /^---$/,
		end: /^---$/,
		excludeBegin: true,
		excludeEnd: true,
		subLanguage: "typescript",
		relevance: 10,
	};

	return {
		name: "Astro",
		aliases: ["astro"],
		case_insensitive: true,
		contains: [
			FRONTMATTER,
			hljs.COMMENT(/<!--/, /-->/, { relevance: 10 }),
			STYLE_TAG,
			SCRIPT_TAG,
			FRAGMENT_TAG,
			OPEN_TAG,
			CLOSE_TAG,
			EXPRESSION,
		],
	};
}
