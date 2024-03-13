import * as React from "react";
import Grid from "@mui/material/Grid";
import { Ingredient, updateRecipeIngredients } from "@/redux/reducers/recipes";
import data from "../../data";
import { IngredientCard } from "@/components/IngredientCards/IngredientCard";
import { useDispatch } from "react-redux";
import { updateEditorState } from "@/redux/reducers/editor";

const IngredientCards = (props: { ingredients: Ingredient[] }) => {
  const dispatch = useDispatch();
  const { ingredients } = props;

  const cardsToDisplay = ingredients.flatMap(({ categoryId, id, quantities }) =>
    quantities.map(({ id: quantityId, value }) => ({
      ...(data.quantities[quantityId] ?? {
        quantity_id: quantityId,
        quantity_unit: "g",
        quantity_step: 1,
        quantity_default_weight: 1,
        category_id: categoryId,
        ingredient_id: id,
        quantity_ingredient_name: id,
      }),
      value,
    }))
  );

  return (
    <Grid container rowGap={2}>
      {cardsToDisplay.map((quantityData) => {
        const onDelete = () => {
          dispatch<any>(
            updateRecipeIngredients({
              recipeId: "userRecipe",
              type: "delete",
              ingredientId: quantityData.ingredient_id,

              quantityId: quantityData.quantity_id,
            })
          );
        };
        const onEdit = () => {
          dispatch(
            updateEditorState({
              currentView: "ingredient",
              categoryId: quantityData.category_id,
              ingredientId: quantityData.ingredient_id,
              quantityId: quantityData.quantity_id,
              quantityValue: quantityData.value,
              ...(quantityData.quantity_id === "unknown"
                ? {
                    currentView: "customIngredient",
                    ingredientName: quantityData.ingredient_id,
                  }
                : {}),
              // This identify the modified ingredient, such that we can delete it if validated
              modifiedIngredient: {
                categoryId: quantityData.category_id,
                ingredientId: quantityData.ingredient_id,
                quantityId: quantityData.quantity_id,
              },
            })
          );
        };
        const onIncrement = () =>
          dispatch<any>(
            updateRecipeIngredients({
              type: "upsert",
              recipeId: "userRecipe",
              ingredientCategoryId: quantityData.category_id,
              ingredientId: quantityData.ingredient_id,
              quantityId: quantityData.quantity_id,
              quantityValue: quantityData.value + quantityData.quantity_step,
            })
          );

        const onDecrement = () =>
          dispatch<any>(
            updateRecipeIngredients({
              type: "upsert",
              recipeId: "userRecipe",
              ingredientCategoryId: quantityData.category_id,
              ingredientId: quantityData.ingredient_id,
              quantityId: quantityData.quantity_id,
              quantityValue: quantityData.value - quantityData.quantity_step,
            })
          );
        return (
          <Grid
            key={quantityData.quantity_id}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
          >
            <IngredientCard
              {...quantityData}
              onDecrement={onDecrement}
              onIncrement={onIncrement}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
export default IngredientCards;
