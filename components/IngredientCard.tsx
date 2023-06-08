import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";

import { Ingredient, updateRecipeIngredients } from "@/redux/reducers/recipes";

import data from "../data";
import { updateEditorState } from "@/redux/reducers/editor";
import { QuantityType } from "../data";

const IngredientCard = (props: QuantityType & { value: number }) => {
  const dispatch = useDispatch();

  const isWeightValue = props.quantity_default_weight !== undefined;

  const unit =
    (isWeightValue && props.quantity_unit_id) ||
    (props.value > 1 && props.quantity_name_plural) ||
    props.quantity_name_singular;

  const step = props.quantity_step ?? 1;
  
  return (
    <Card variant="outlined" sx={{ maxWidth: 300, m: "auto" }}>
      <Typography level="h2" fontSize="md">
        {props.quantity_ingredient_name}
      </Typography>
      {/* <Typography level="body2">({props.quantity_name})</Typography> */}

      <AspectRatio
        minHeight="150px"
        maxHeight="300px"
        objectFit="contain"
        sx={{ my: 1 }}
      >
        <img src={props.quantity_image_url} loading="lazy" alt="" />
      </AspectRatio>
      <Box sx={{ display: "flex", py: 1, justifyContent: "space-between" }}>
        <Button
          variant="solid"
          color="neutral"
          size="sm"
          disabled={props.value < 2}
          onClick={() =>
            dispatch<any>(
              updateRecipeIngredients({
                type: "upsert",
                recipeId: "userRecipe",
                ingredientCategoryId: props.category_id,
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
                quantityValue: props.value - step,
              })
            )
          }
        >
          -
        </Button>
        <Typography>{`${props.value} ${unit}`}</Typography>

        <Button
          variant="solid"
          color="neutral"
          size="sm"
          onClick={() =>
            dispatch<any>(
              updateRecipeIngredients({
                type: "upsert",
                recipeId: "userRecipe",
                ingredientCategoryId: props.category_id,
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
                quantityValue: props.value + step,
              })
            )
          }
        >
          +
        </Button>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Button
          variant="solid"
          size="md"
          fullWidth
          color="danger"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: "auto", fontWeight: 600, mr: 5 }}
          onClick={() =>
            dispatch<any>(
              updateRecipeIngredients({
                recipeId: "userRecipe",
                type: "delete",
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
              })
            )
          }
        >
          Delete
        </Button>
        <Button
          variant="solid"
          size="md"
          fullWidth
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: "auto", fontWeight: 600 }}
          onClick={() => {
            dispatch(
              updateEditorState({
                currentView: "ingredient",
                categoryId: props.category_id,
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
                quantityValue: props.value,
                // This identify the modified ingredient, such that we can delete it if validated
                modifiedIngredient: {
                  categoryId: props.category_id,
                  ingredientId: props.ingredient_id,
                  quantityId: props.quantity_id,
                },
              })
            );
          }}
        >
          Edit
        </Button>
      </Box>
    </Card>
  );
};

const IngredientCards = (props: { ingredients: Ingredient[] }) => {
  const { ingredients } = props;

  const cardsToDisplay = ingredients.flatMap(({ quantities }) =>
    quantities.map(({ id: quantityId, value }) => ({
      ...data.quantities[quantityId],
      value,
    }))
  );

  return (
    <Grid container rowGap={2}>
      {cardsToDisplay.map((quantityData) => (
        <Grid
          key={quantityData.quantity_id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
        >
          <IngredientCard {...quantityData} />
        </Grid>
      ))}
    </Grid>
  );
};
export default IngredientCards;
