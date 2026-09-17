import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Recipe } from "../types";

type Status = "loading" | "ready" | "error";

type RecipesContextValue = {
	recipes: Recipe[];
	status: Status;
};

const RecipesContext = createContext<RecipesContextValue | null>(null);

export function RecipesProvider({ children }: { children: ReactNode }) {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [status, setStatus] = useState<Status>("loading");

	useEffect(() => {
		let cancelled = false;

		fetch("/recipes.json")
			.then((res) => {
				if (!res.ok) throw new Error(`Fehler beim Laden der Rezepte (${res.status})`);
				return res.json() as Promise<Recipe[]>;
			})
			.then((data) => {
				if (cancelled) return;
				setRecipes(data);
				setStatus("ready");
			})
			.catch(() => {
				if (cancelled) return;
				setStatus("error");
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return <RecipesContext.Provider value={{ recipes, status }}>{children}</RecipesContext.Provider>;
}

export function useRecipes(): RecipesContextValue {
	const ctx = useContext(RecipesContext);
	if (!ctx) throw new Error("useRecipes muss innerhalb von RecipesProvider verwendet werden");
	return ctx;
}
