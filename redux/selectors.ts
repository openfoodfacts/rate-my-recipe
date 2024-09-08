import { createSelector } from "reselect";
import { RootState } from "./store";
import data, { QuantityType } from "../data";
import { VALUE, QUANTITY, INGREDIENT } from "./reducers/recipes";

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
    (editor.categoryId != undefined && data.categories[editor.categoryId]) ||
    null
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
  (editor) => {
    if (editor.quantityId === "unknown") {
      return {
        quantity_id: "undefined",
        quantity_unit: "g",
        quantity_step: 1,
        category_id: editor.categoryId,
        ingredient_id: editor.ingredientId,
      } as QuantityType;
    }
    return (
      (editor.quantityId != undefined && data.quantities[editor.quantityId]) ||
      null
    );
  }
);
