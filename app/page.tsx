"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import AppBar from "@/components/AppBar";
import IngredientSelector from "@/components/IngredientSelector";
import IngredientCards from "@/components/IngredientCard";
import PublishRecipe from "@/components/PublishRecipe";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";

import "./i18n";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentIngredients } from "@/redux/selectors";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import { RootState } from "@/redux/store";
import { openEditor } from "@/redux/reducers/editor";

import Sheet from "@mui/joy/Sheet";
import Add from "@mui/icons-material/Add";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const ingredients = Array.from(searchParams.entries());

    if (ingredients.length !== 0) {
      dispatch<any>(
        updateRecipeIngredients({
          recipeId: "userRecipe",
          type: "overideFromURLParams",
          ingredients: ingredients.map(([key, value]) => ({
            key,
            value,
          })),
        })
      );

      dispatch<any>(
        updateRecipeIngredients({
          recipeId: "urlRecipe",
          type: "overideFromURLParams",
          ingredients: ingredients.map(
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
        <Stack direction="row" spacing={2} alignItems="center"
  justifyContent="center">
        <Button
          variant="solid"
          color="primary"
          startDecorator={<Add />}
          onClick={() => dispatch(openEditor({}))}
        >
          {t("actions.add_ingredient")}
        </Button>
        <PublishRecipe />
        </Stack>

        <ShowNutritionalTable />
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
