import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";

import { Ingredient, updateRecipeIngredients } from "@/redux/reducers/recipes";

import data from "../../data";
import { updateEditorState } from "@/redux/reducers/editor";
import { QuantityType } from "../../data";
import { getUnit } from "@/data/utils";
import {EditButtons} from "@/components/IngredientCard/components/EditButtons";
import {CountingPanel} from "@/components/IngredientCard/components/CountingPanel";

const IngredientCard = (props: QuantityType & { value: number }) => {
  const dispatch = useDispatch();

  const isWeightValue = props.quantity_default_weight !== undefined;

    const onDelete = () => {
        dispatch<any>(
            updateRecipeIngredients({
                recipeId: "userRecipe",
                type: "delete",
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
            })
        )
    }

    const onEdit = () => {
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
        );}
    const onIncrement = () =>
        dispatch<any>(
            updateRecipeIngredients({
                type: "upsert",
                recipeId: "userRecipe",
                ingredientCategoryId: props.category_id,
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
                quantityValue: props.value + props.quantity_step,
            })
        )

    const onDecrement = () =>
        dispatch<any>(
            updateRecipeIngredients({
                type: "upsert",
                recipeId: "userRecipe",
                ingredientCategoryId: props.category_id,
                ingredientId: props.ingredient_id,
                quantityId: props.quantity_id,
                quantityValue: props.value - props.quantity_step,
            })
        )

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

        <CountingPanel onIncrement={onIncrement} onDecrement={onDecrement} disabledDecrement={props.value < 2}> <Typography>{`${props.value} ${getUnit(
            props,
            props.value
        )}`}</Typography></CountingPanel>
          <EditButtons onEdit={onEdit} onDelete={onDelete}/>
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
