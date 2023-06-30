import { QuantityType } from "@/data";
import { useDispatch } from "react-redux";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import { updateEditorState } from "@/redux/reducers/editor";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import AspectRatio from "@mui/joy/AspectRatio";
import { CountingPanel } from "@/components/IngredientCard/components/CountingPanel";
import { getUnit } from "@/data/utils";
import { EditButtons } from "@/components/IngredientCard/components/EditButtons";
import * as React from "react";

export const IngredientCard = (props: QuantityType & { value: number }) => {
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
    );
  };

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
    );
  };
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
    );

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
    );

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

      <CountingPanel
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        disabledDecrement={props.value < 2}
      >
        <Typography>{`${props.value} ${getUnit(
          props,
          props.value
        )}`}</Typography>
      </CountingPanel>
      <EditButtons onEdit={onEdit} onDelete={onDelete} />
    </Card>
  );
};
