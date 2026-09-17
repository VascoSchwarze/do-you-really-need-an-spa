import { Route, Routes } from "react-router-dom";
import { RecipesProvider } from "./context/RecipesContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <RecipesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rezepte" element={<Recipes />} />
          <Route path="rezepte/:slug" element={<RecipeDetail />} />
          <Route path="ueber-uns" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </RecipesProvider>
  );
}
