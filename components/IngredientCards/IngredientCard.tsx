import { QuantityType } from "@/data";
import { useDispatch } from "react-redux";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import { updateEditorState } from "@/redux/reducers/editor";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { ValueEditor } from "@/components/IngredientCards/ValueEditor";
import { getUnit } from "@/data/utils";
import * as React from "react";
import { IngredientPicture } from "@/components/IngredientCards/IngredientPicture";

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
      <IngredientPicture
        ingredientName={props.quantity_ingredient_name}
        imageUrl={props.quantity_image_url}
      />
      <ValueEditor
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        disabledDecrement={props.value < 2}
        onDelete={onDelete}
        onEdit={onEdit}
      >
        <Typography>{`${props.value} ${getUnit(
          props,
          props.value
        )}`}</Typography>
      </ValueEditor>
    </Card>
  );
};
