import { createSelector } from "reselect";
import { RootState } from "./store";
import data from "../data/ingredient_taxonomy.json";
import { DataType } from "./reducers/editor";

export const selectCurrentIngredients = createSelector(
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipeV2.recipes,
  (currentRecipeId, recipes) => recipes[currentRecipeId].ingredients
);

export const selectEditorState = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor
);

export const selectEditorView = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor.currentView
);

export const selectEditorCurrentType = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (data as DataType).find(
      (type) => type["Ingredient type id"] === editor.typeId
    ) ?? null
);

export const selectEditorCurrentIngredient = createSelector(
  (state: RootState) => state.editor,
  selectEditorCurrentType,
  (editor, currentType) =>
    (currentType &&
      currentType.ingredients.find(
        (ingredient) => ingredient["Ingredient id"] === editor.ingredientId
      )) ??
    null
);

export const selectEditorCurrentQuantity = createSelector(
  (state: RootState) => state.editor,
  selectEditorCurrentIngredient,
  (editor, currentIngredient) =>
    (currentIngredient &&
      currentIngredient.quantities.find(
        (quantity) => quantity["Quantity id"] === editor.quantityId
      )) ??
    null
);
