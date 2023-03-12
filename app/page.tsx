import IngredientList from "@/components/IngredientsList";
import IngredientSelector from "@/components/IngredientsSeletor";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "row" }}>
      <IngredientList />
      <IngredientSelector />
    </main>
  );
}
