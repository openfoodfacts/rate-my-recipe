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
import Sheet from "@mui/joy/Sheet";
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
        maxHeight: "100vh",
        position: "relative",
      }}
    >
      <AppBar />
      <Stack
        direction="row"
        flexWrap="wrap"
        sx={{
          my: 2,
        }}
      >
        {ingrdients.map((ingredient) => (
          <IngredientCard {...ingredient} key={ingredient.id} />
        ))}
      </Stack>
      <Sheet
        variant="soft"
        color="neutral"
        invertedColors
        sx={{
          pt: 2,
          position: "sticky",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => dispatch(openEditor({}))}
          sx={{ mb: 2 }}
        >
          Add Ingredient
        </Button>
        <ShowNutritionalTable />
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
