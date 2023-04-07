"use client";

import * as React from "react";
import { v4 as uuid } from "uuid";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch } from "react-redux";
import { copyRecipe } from "@/redux/reducers/recipes";

export default function Home() {
  const [recipeIds, setRecipeIds] = React.useState(["empty_recipe"]);
  const dispatch = useDispatch();

  const copy = (recipeId: string) => () => {
    const newId = uuid();
    dispatch(copyRecipe({ recipeId, createdId: newId }));
    setRecipeIds((prev) => [...prev, newId]);
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "row",
        maxWidth: "100%",
        overflow: "auto",
      }}
    >
      <IngredientSelector />
    </main>
  );
}
