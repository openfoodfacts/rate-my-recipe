"use client";

import * as React from "react";

import { useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import store, { RootState } from "@/redux/store";
import Send from "@mui/icons-material/Send";
import Button from "@mui/joy/Button";
import { useTranslation } from "react-i18next";
import data from "../data";

const PublishRecipe = () => {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  const params = useSelector((state: RootState) =>
    selectURLParams(state, "userRecipe")
  );

  // The share button makes a POST request to publish_url and sends the ingredients and scores
  function handlePublishRecipeButtonClick() {
    const url =
      new URLSearchParams(document.location.search).get("publish_url") ||
      "https://amathjourney.com/api/yololo";

    // get the scores
    const nutriscore = store.getState().recipe.recipes.userRecipe.nutriscore;
    const nutriscore_100 =
      store.getState().recipe.recipes.userRecipe.nutriscore_100;
    const ecoscore = store.getState().recipe.recipes.userRecipe.ecoscore;
    const ecoscore_100 =
      store.getState().recipe.recipes.userRecipe.ecoscore_100;

    // build a list of ingredients with their name, weight and unit
    const currentIngredients = selectCurrentIngredients(
      store.getState(),
      "userRecipe"
    );

    const ingredients = currentIngredients.flatMap((ingredient) => {
      const ingredientData = data.ingredients[ingredient.id];

      return ingredient.quantities.map((quantity) => {
        const quantityData = data.quantities[quantity.id];

        const isPerUnit =
          quantityData.quantity_default_weight_per_unit !== undefined;

        const weight =
          quantity.value *
          (isPerUnit ? quantityData.quantity_default_weight_per_unit! : 1);

        const ingredientName =
          quantityData.quantity_ingredient_name ||
          ingredientData.ingredient_name;

        return {
          name: ingredientName,
          weight: weight,
          unit: quantityData.quantity_unit!,
          quantity_value: quantity.value,
          quantity_name: quantityData.quantity_name_plural
        };
      });
    });

    const body = JSON.stringify({
      // the return_url allows to go back to the current recipe
      return_url: `${window.location.origin}${window.location.pathname}?${params}`,
      ingredients,
      nutriscore,
      nutriscore_100,
      ecoscore,
      ecoscore_100,
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
        if (data.url) {
            window.location.assign(data.url);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (

    <Button
    variant="solid"
    color="primary"
    startDecorator={<Send />}
    onClick={() => handlePublishRecipeButtonClick()}
    sx={{ mb: 2 }}
  >
    {t("actions.publish_recipe")}
  </Button>

  );
};

export default PublishRecipe;
