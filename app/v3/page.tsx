"use client";

import * as React from "react";
import { v4 as uuid } from "uuid";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { copyRecipe } from "@/redux/reducers/recipes";
import { selectCurrentIngredients } from "@/redux/selectors_v2";
import { RootState } from "@/redux/store";
import ingredientsSlice from "@/redux/reducers/ingredients";
import IngredientCard from "@/components/IngredientCardV3";
import { Button, Stack } from "@mui/material";
import { openEditor } from "@/redux/reducers/editor";
import { Sheet } from "@mui/joy";

export default function Home() {
  const dispatch = useDispatch();

  const ingrdients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "empty_recipe")
  );
  console.log({ ingrdients });

  return (
    <main
      style={{
        maxWidth: "100%",
      }}
    >
      <Stack direction="row" flexWrap="wrap">
        {ingrdients.map((ingredient) => (
          <IngredientCard {...ingredient} key={ingredient.id} />
        ))}
      </Stack>
      <Sheet
        sx={{
          p: 2,
          position: "fixed",
          bottom: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Button sx={{ px: 5 }} onClick={() => dispatch(openEditor({}))}>
          Add Ingredient
        </Button>
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
