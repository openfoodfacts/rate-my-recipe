import { createSelector } from "reselect";
import { RootState } from "./store";
import data from "../data";
import { VALUE, QUANTITY, INGREDIENT } from "./reducers/recipes";

export const selectUserNutriscore = createSelector(
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipe.recipes,
  (currentRecipeId, recipes) => recipes[currentRecipeId].nutriscore
);

//   (state: RootState) => state.recipe.recipes["userRecipe"].nutriscore


export const selectCurrentIngredients = createSelector(
  
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipe.recipes,
  (currentRecipeId, recipes) => recipes[currentRecipeId].ingredients

);

export const selectURLParams = createSelector(
  selectCurrentIngredients,
  (ingredients) => {
    let i = 0;
    return ingredients
      .flatMap((ingredient) =>
        ingredient.quantities.flatMap((quantity) => {
          i += 1;
          return [
            `${INGREDIENT}${i}=${ingredient.id}`,
            `${QUANTITY}${i}=${quantity.id}`,
            `${VALUE}${i}=${quantity.value}`,
          ];
        })
      )
      .join("&");
  }
);

export const selectEditorState = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor
);

export const selectEditorView = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor.currentView
);

export const selectEditorCurrentCategory = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.categoryId != undefined && data.categories[editor.categoryId]) || null
);

export const selectEditorCurrentIngredient = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.ingredientId != undefined &&
      data.ingredients[editor.ingredientId]) ||
    null
);

export const selectEditorCurrentQuantity = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.quantityId != undefined && data.quantities[editor.quantityId]) ||
    null
);
