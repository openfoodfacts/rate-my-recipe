import IngredientList from "@/components/IngredientListV2";
import IngredientSelector from "@/components/IngredientsSeletor";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "row" }}>
      <IngredientList />
    </main>
  );
}
