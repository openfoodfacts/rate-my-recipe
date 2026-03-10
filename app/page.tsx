"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

import AppBar from "@/components/AppBar";
import IngredientSelector from "@/components/IngredientSelector";
import IngredientCards from "@/components/IngredientCards";
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
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";

import { useTranslation } from "react-i18next";
import { MuiJoyTheme } from "@/theme";

/**
 * Main application page component for Rate My Recipe.
 * 
 * This is the primary user interface that orchestrates the entire recipe creation
 * and nutritional analysis experience. It handles:
 * 
 * - URL parameter parsing for shared recipes
 * - Theme provider setup (Material-UI + Joy UI)
 * - Recipe state management via Redux
 * - User interactions (add, edit, delete ingredients)
 * - Nutritional data display
 * 
 * Component Structure:
 * - AppBar: Navigation and sharing controls
 * - IngredientCards: Display selected ingredients
 * - Bottom Sheet: Controls for adding ingredients and viewing nutrition
 * - IngredientSelector: Modal for ingredient selection
 * 
 * URL Parameters:
 * Supports recipe sharing via URL parameters (i1, q1, v1 format).
 * On mount, checks for URL parameters and loads them into the recipe state.
 * 
 * @component
 * @returns {JSX.Element} The main application page
 * 
 * @example
 * // Accessed via URL with recipe parameters
 * // https://example.com/?i1=chicken&q1=chicken.breast-unit&v1=4
 * // Will automatically load the recipe with 4 chicken breasts
 */
export default function Home() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const materialTheme = materialExtendTheme();
  
  /**
   * Effect: Parse and load recipe from URL parameters on mount.
   * 
   * When the page loads with URL parameters (shared recipe), this effect:
   * 1. Extracts all search parameters from the URL
   * 2. Dispatches updateRecipeIngredients for both userRecipe and urlRecipe
   * 3. Triggers API call to calculate nutritional information
   * 
   * The urlRecipe is kept as a separate copy to allow comparison between
   * the original shared recipe and any user modifications.
   * 
   * Only runs when searchParams changes (i.e., URL changes).
   */
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
          ingredients: ingredients.map(([key, value]) => ({
            key,
            value,
          })),
        })
      );
    }
  }, [dispatch, searchParams]);

  const ingredients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "userRecipe")
  );

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider theme={MuiJoyTheme}>
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
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
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
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
