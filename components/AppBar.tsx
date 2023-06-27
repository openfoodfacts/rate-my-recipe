"use client";

import * as React from "react";

import { useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import store, { RootState } from "@/redux/store";

import { Snackbar } from "@mui/material";

import Box from "@mui/joy/Box";
import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";
import Sheet from "@mui/joy/Sheet";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import { useTranslation } from "react-i18next";
import data from "../data";

const AppBar = () => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const params = useSelector((state: RootState) =>
    selectURLParams(state, "userRecipe")
  );

  // The share button makes a POST request to share_url and sends the ingredients and scores
  function handleShareButtonClick() {
    const url = new URLSearchParams(document.location.search).get('share_url') || "https://amathjourney.com/api/yololo";

    // get the scores
    const nutriscore = store.getState().recipe.recipes.userRecipe.nutriscore;
    const nutriscore_100 = store.getState().recipe.recipes.userRecipe.nutriscore_100;
    const ecoscore = store.getState().recipe.recipes.userRecipe.ecoscore;
    const ecoscore_100 = store.getState().recipe.recipes.userRecipe.ecoscore_100;    

    // build a list of ingredients with their name, weight and unit
    const currentIngredients = selectCurrentIngredients(
      store.getState(),
      "userRecipe"
    );

    const ingredients = currentIngredients
      .flatMap((ingredient) => {
        const ingredientData = data.ingredients[ingredient.id];

        return ingredient.quantities.map((quantity) => {
          const quantityData = data.quantities[quantity.id];

          const isPerUnit =
            quantityData.quantity_default_weight_per_unit !== undefined;

          const weight =
            quantity.value *
            (isPerUnit ? quantityData.quantity_default_weight_per_unit! : 1);

          const ingredientName = quantityData.quantity_ingredient_name || ingredientData.ingredient_name;

          return {
            name: ingredientName,
            weight: weight,
            unit: quantityData.quantity_unit!
          };
        });
      });

    const body = JSON.stringify({
      // the return_url allows to go back to the current recipe
      return_url : `${window.location.origin}${window.location.pathname}?${params}`,
      ingredients,
      nutriscore, 
      nutriscore_100, 
      ecoscore,
      ecoscore_100
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <Sheet
      variant="solid"
      color="primary"
      invertedColors
      sx={(theme) => ({
        width: "100%",
        height: "54px",
        ...theme.typography.h5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
      })}
    >
      Rate My Recipes
      <Box>
        <Tooltip title={t("appbar.share_link")}>
          <IconButton
            sx={{ mr: 1 }}
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}${window.location.pathname}?${params}`
              );
              setOpen(true);
            }}
          >
            <ShareIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t("appbar.save_recipe")}>
          <IconButton
            onClick={() => {
              handleShareButtonClick();
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        message={t("messages.copied")}
      />
    </Sheet>
  );
};

export default AppBar;
