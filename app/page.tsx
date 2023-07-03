"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentIngredients } from "@/redux/selectors";
import { RootState } from "@/redux/store";
import IngredientCards from "@/components/IngredientCards";
import { openEditor } from "@/redux/reducers/editor";
import Sheet from "@mui/joy/Sheet";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";
import Add from "@mui/icons-material/Add";
import AppBar from "@/components/Appbar/AppBar";
import Button from "@mui/joy/Button";
import Box from "@mui/joy/Box";

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

  const ingredients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "userRecipe")
  );

  return (
    <main
      style={{
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar />
      <Box sx={{ my: 2, mx: 1, flexGrow: 1 }}>
        <IngredientCards ingredients={ingredients} />
      </Box>
      <Sheet
        variant="soft"
        color="neutral"
        invertedColors
        sx={{
          pt: 2,
          pb: 1,
          position: "sticky",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <Button
          variant="solid"
          color="primary"
          startDecorator={<Add />}
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
