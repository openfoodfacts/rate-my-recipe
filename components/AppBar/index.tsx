"use client";

import * as React from "react";
import { useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import store, { RootState } from "@/redux/store";
import { Snackbar } from "@mui/material";
import { TooltipButtons } from "./TooltipButtons";
import { AppBarContainer } from "./AppBarContainer";

const AppBar = () => {
  const [open, setOpen] = React.useState(false);

  const params = useSelector((state: RootState) =>
    selectURLParams(state, "userRecipe")
  );
  function handleShareButtonClick() {
    const url = "https://amathjourney.com/api/yololo";

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
    const body = JSON.stringify({ valuesAndQuantities });

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
  const onShareButtonClick = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?${params}`
    );
    setOpen(true);
  };
  const onSaveRecipe = () => {
    handleShareButtonClick();
  };
  return (
    <AppBarContainer>
      ContribAlim
    </AppBarContainer>
  );
};

export default AppBar;
