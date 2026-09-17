import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "recipe-app:favorites";

function readFavorites(): Set<string> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? new Set(JSON.parse(raw)) : new Set();
	} catch {
		return new Set();
	}
}

let favorites = readFavorites();
const listeners = new Set<() => void>();

function writeFavorites(next: Set<string>) {
	favorites = next;
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
	listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}

function getSnapshot() {
	return favorites;
}

export function useFavorites() {
	const favorites = useSyncExternalStore(subscribe, getSnapshot);

	const toggleFavorite = useCallback((slug: string) => {
		const next = new Set(getSnapshot());
		if (next.has(slug)) next.delete(slug);
		else next.add(slug);
		writeFavorites(next);
	}, []);

	const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites]);

	return { favorites, isFavorite, toggleFavorite };
}
