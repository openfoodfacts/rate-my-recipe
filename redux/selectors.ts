import { createSelector } from "reselect";
import { RootState } from "./store";
import data from "../data";
import { VALUE, QUANTITY, INGREDIENT } from "./reducers/recipes";

/**
 * Selects the ingredients array for a specific recipe.
 * 
 * Memoized selector that returns the ingredients list for the specified recipe ID.
 * Uses reselect for performance - only recomputes when recipe ID or recipes object changes.
 * 
 * @param {RootState} state - Redux root state
 * @param {string} currentRecipeId - Recipe ID ('userRecipe' or 'urlRecipe')
 * @returns {Ingredient[]} Array of ingredients with quantities
 * 
 * @example
 * const ingredients = useSelector(state => 
 *   selectCurrentIngredients(state, 'userRecipe')
 * );
 */
export const selectCurrentIngredients = createSelector(
  
  (state: RootState, currentRecipeId: string) => currentRecipeId,
  (state: RootState) => state.recipe.recipes,
  (currentRecipeId, recipes) => recipes[currentRecipeId].ingredients

);

/**
 * Generates URL parameter string from recipe ingredients.
 * 
 * Converts the ingredients array into URL query parameters following the format:
 * i1=ingredientId&q1=quantityId&v1=value&i2=...
 * 
 * Used for recipe sharing functionality - encodes entire recipe in URL.
 * 
 * @param {Ingredient[]} ingredients - Recipe ingredients (from selectCurrentIngredients)
 * @returns {string} URL-encoded parameter string
 * 
 * @example
 * // Input: [{ id: 'chicken', quantities: [{ id: 'chicken.breast-unit', value: 4 }] }]
 * // Output: "i1=chicken&q1=chicken.breast-unit&v1=4"
 * 
 * const urlParams = useSelector(state => 
 *   selectURLParams(selectCurrentIngredients(state, 'userRecipe'))
 * );
 */
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

/**
 * Selects the complete editor state object.
 * 
 * Returns the entire editor state including current view, selected IDs, and values.
 * Used when components need access to multiple editor properties.
 * 
 * @param {RootState} state - Redux root state
 * @returns {EditorState} Complete editor state object
 * 
 * @example
 * const editorState = useSelector(selectEditorState);
 * // Returns: { currentView, categoryId, ingredientId, quantityId, quantityValue, modifiedIngredient }
 */
export const selectEditorState = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor
);

/**
 * Selects the current editor view state.
 * 
 * Returns which step of the selection process is currently active.
 * 
 * @param {RootState} state - Redux root state
 * @returns {'category' | 'ingredient' | 'quantity' | 'value' | null} Current view or null if closed
 * 
 * @example
 * const currentView = useSelector(selectEditorView);
 * // Returns: 'category', 'ingredient', 'quantity', 'value', or null
 */
export const selectEditorView = createSelector(
  (state: RootState) => state.editor,
  (editor) => editor.currentView
);

/**
 * Selects the currently selected category data from the ingredient database.
 * 
 * Looks up the category by ID in the ingredients_config data.
 * Returns null if no category is selected or if category ID is invalid.
 * 
 * @param {RootState} state - Redux root state
 * @returns {CategoryData | null} Category data object or null
 * 
 * @example
 * const category = useSelector(selectEditorCurrentCategory);
 * // Returns: { category_id, category_name, category_description, ingredients: [...] }
 */
export const selectEditorCurrentCategory = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.categoryId != undefined && data.categories[editor.categoryId]) || null
);

/**
 * Selects the currently selected ingredient data from the ingredient database.
 * 
 * Looks up the ingredient by ID in the ingredients_config data.
 * Returns null if no ingredient is selected or if ingredient ID is invalid.
 * 
 * @param {RootState} state - Redux root state
 * @returns {IngredientData | null} Ingredient data object or null
 * 
 * @example
 * const ingredient = useSelector(selectEditorCurrentIngredient);
 * // Returns: { ingredient_id, ingredient_name, quantities: [...], ... }
 */
export const selectEditorCurrentIngredient = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.ingredientId != undefined &&
      data.ingredients[editor.ingredientId]) ||
    null
);

/**
 * Selects the currently selected quantity data from the ingredient database.
 * 
 * Looks up the quantity by ID in the ingredients_config data.
 * Returns null if no quantity is selected or if quantity ID is invalid.
 * 
 * @param {RootState} state - Redux root state
 * @returns {QuantityData | null} Quantity data object or null
 * 
 * @example
 * const quantity = useSelector(selectEditorCurrentQuantity);
 * // Returns: { quantity_id, quantity_name_plural, quantity_unit, quantity_default_weight, ... }
 */
export const selectEditorCurrentQuantity = createSelector(
  (state: RootState) => state.editor,
  (editor) =>
    (editor.quantityId != undefined && data.quantities[editor.quantityId]) ||
    null
);
