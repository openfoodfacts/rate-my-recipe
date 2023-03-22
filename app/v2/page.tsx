"use client";

import * as React from "react";
import { v4 as uuid } from "uuid";
import IngredientList from "@/components/IngredientListV2";

import { useDispatch } from "react-redux";
import { copyRecipe } from "@/redux/reducers/recipes";
import { Divider } from "@mui/material";

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
      {recipeIds.map((recipeId, recipeIndex) => (
        <IngredientList
          recipeId={recipeId}
          key={recipeId}
          copy={copy(recipeId)}
          remove={
            recipeIndex === 0
              ? undefined
              : () =>
                  setRecipeIds((prev) => prev.filter((id) => id !== recipeId))
          }
        />
      ))}
    </main>
  );
}
