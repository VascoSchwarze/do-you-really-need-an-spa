import Reveal from "reveal.js";
import "reveal.js/reveal.css";
import "reveal.js/theme/black.css";
// import "reveal.js/theme/beige.css"; // uninvert sciota-logo, astro logo, islands architecture diagram and metrics tables if used
import "../assets/atom-one-dark.min.css";

import RevealHighlight from "reveal.js/plugin/highlight";
import RevealNotes from "reveal.js/plugin/notes";
import astro from "./highlight-astro";

const deck = new Reveal({
	highlight: {
		beforeHighlight: (hljs) => hljs.registerLanguage("astro", astro),
	},
	hash: true,
	plugins: [RevealHighlight, RevealNotes],
	width: 1280,
	height: 800,
	controls: "speaker",
	controlsTutorial: false,
	slideNumber: true,
});

deck.initialize();
