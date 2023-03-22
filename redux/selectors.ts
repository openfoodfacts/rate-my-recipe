import { createSelector } from "reselect";
import { RootState } from "./store";

export const selectCurrentIngredients = createSelector(
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipe.recipes,
  (state: RootState) => state.ingredients,
  (currentRecipeId, recipes, ingredients) =>
    recipes[currentRecipeId].ingredients.map(({ id, quantity }) => ({
      ...ingredients.values[id],
      quantity,
    }))
);

export const selectCurrentIngredientsIds = createSelector(
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipe.recipes,
  (state: RootState) => state.ingredients,
  (currentRecipeId, recipes, ingredients) =>
    recipes[currentRecipeId].ingredients.map(({ id }) => id)
);

export const selectAvailableIngredients = createSelector(
  (state: RootState) => state.ingredients,
  (state: RootState, ingredientType: string) => ingredientType,
  (ingredients, ingredientType) =>
    ingredients.ids
      .filter((id) => ingredients.values[id].type === ingredientType)
      .map((id) => ingredients.values[id])
);

/**
 * Select ingreditent unused in a give recipe, and in a certain category. `ingredientType` can be empty
 */
export const selectUnusedIngredients = createSelector(
  (state: RootState) => state.ingredients,
  (state: RootState, ingredientType: string) => ingredientType,
  (state: RootState, ingredientType: string, recipeId: string) =>
    state.recipe.recipes[recipeId].ingredients.map(
      (ingredient) => ingredient.id
    ),
  (ingredients, ingredientType, usedIds) =>
    ingredients.ids
      .filter(
        (id) =>
          (!ingredientType || ingredients.values[id].type === ingredientType) &&
          !usedIds.includes(id)
      )
      .map((id) => ingredients.values[id])
);
