"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import { RootState } from "@/redux/store";
import IngredientCard from "@/components/IngredientCard";
import { Button, Stack } from "@mui/material";
import { openEditor } from "@/redux/reducers/editor";
import { Sheet } from "@mui/joy";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";
import Add from "@mui/icons-material/Add";
import AppBar from "@/components/AppBar";

export default function Home() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  React.useEffect(() => {
    dispatch<any>(
      updateRecipeIngredients({
        recipeId: "userRecipe",
        type: "overideFromURLParams",
        ingredients: Array.from(searchParams.entries()).map(([key, value]) => ({
          key,
          value,
        })),
      })
    );
    if (Array.from(searchParams.entries()).length !== 0) {
      dispatch<any>(
        updateRecipeIngredients({
          recipeId: "urlRecipe",
          type: "overideFromURLParams",
          ingredients: Array.from(searchParams.entries()).map(
            ([key, value]) => ({
              key,
              value,
            })
          ),
        })
      );
    }
  }, [dispatch, searchParams]);

  const ingrdients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "userRecipe")
  );

  return (
    <main
      style={{
        maxWidth: "100%",
      }}
    >
      <AppBar />
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
          marginTop: "20px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => dispatch(openEditor({}))}
        >
          Add Ingredient
        </Button>
        <ShowNutritionalTable />
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
