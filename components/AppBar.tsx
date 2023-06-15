"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { selectUserNutriscore, selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import store, { RootState } from "@/redux/store";
import IngredientCard from "@/components/IngredientCard";
import { Button, Icon, Snackbar, Stack } from "@mui/material";
import { openEditor } from "@/redux/reducers/editor";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";

import Box from "@mui/joy/Box";

import ShareIcon from "@mui/icons-material/Share";
import SaveIcon from "@mui/icons-material/Save";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";
import { IconButton, Tooltip } from "@mui/joy";

const AppBar = () => {
  const [open, setOpen] = React.useState(false);

  const params = useSelector((state: RootState) =>
    selectURLParams(state, "userRecipe")
  );
  function handleShareButtonClick() {
    const url = "https://amathjourney.com/api/yololo";

    const userNutriscore = selectUserNutriscore(store.getState(), "userRecipe");

    const ingredients = selectCurrentIngredients(
      store.getState(),
      "userRecipe"
    );

    const valuesAndQuantities = ingredients.flatMap((ingredient) =>
      ingredient.quantities.map((quantity) => ({
        quantity: quantity.id,
        value: quantity.value,
      }))
    );
    const body = JSON.stringify({ valuesAndQuantities, nutriscore: userNutriscore });

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
        <Tooltip title="Partager un lien">
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
        <Tooltip title="Enregistrer la recette">
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
        message="Lien copié dans le presse-papier"
      />
    </Sheet>
  );
};

export default AppBar;
