import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import data from "../../data";

/**
 * Calculates the default value for a quantity based on its configuration.
 * 
 * Priority order:
 * 1. quantity_default_number_of_units (for unit-based quantities like "4 chicken breasts")
 * 2. quantity_default_weight (for weight-based quantities like "500g rice")
 * 3. 1 (fallback default)
 * 
 * @param {EditorState} state - Current editor state containing quantityId
 * @returns {number} Default value for the quantity
 * @throws {Error} If quantityId is null or undefined, or if quantity data not found
 * 
 * @example
 * // For chicken breast (unit-based): returns 4 (default number of breasts)
 * // For rice (weight-based): returns 500 (default grams)
 * // For unknown: returns 1 (fallback)
 */
const getDefaultQuantityValue = (state: EditorState) => {
  if (state.quantityId == null) {
    throw new Error(`state.quantityId is "${state.quantityId}"`);
  }

  const currentQuantity = data.quantities[state.quantityId];

  if (currentQuantity === undefined) {
    throw new Error(`Unknown quantity id "${state.quantityId}"`);
  }

  if (
    currentQuantity.quantity_default_number_of_units !== undefined &&
    !Number.isNaN(currentQuantity.quantity_default_number_of_units)
  ) {
    return Number(currentQuantity.quantity_default_number_of_units);
  }

  if (
    currentQuantity.quantity_default_weight !== undefined &&
    !Number.isNaN(currentQuantity.quantity_default_weight)
  ) {
    return Number(currentQuantity.quantity_default_weight);
  }
  return 1;
};

export type ViewsTypes = "category" | "ingredient" | "quantity" | "value";

type EditorState = {
  currentView: null | ViewsTypes;
  categoryId?: string | null;
  ingredientId?: string | null;
  quantityId?: string | null;
  quantityValue?: number | null;
  // This identifies the modified ingredient, so that we can delete it if validated
  modifiedIngredient?: {
    categoryId: string | null;
    ingredientId: string | null;
    quantityId: string | null;
  };
};

/**
 * Editor slice managing the ingredient selection state machine.
 * 
 * The editor controls the multi-step ingredient selection process:
 * null → category → ingredient → quantity → value → null (validated/cancelled)
 * 
 * State transitions are managed through reducer actions that update
 * the current view and maintain selection state at each step.
 */
const editor = createSlice<EditorState, SliceCaseReducers<EditorState>, string>(
  {
    name: "editor",
    initialState: {
      currentView: null,
      categoryId: null,
      ingredientId: null,
      quantityId: null,
      quantityValue: null,
    },
    reducers: {
      /**
       * Generic state updater for editor properties.
       * Use specific reducers (updateCategory, updateIngredient, etc.) when available.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<EditorState>} action - Partial state to merge
       */
      updateEditorState: (state, action: PayloadAction<EditorState>) => {
        return { ...state, ...action.payload };
      },
      /**
       * Updates the selected category and resets dependent state.
       * 
       * When category changes, ingredient, quantity, and value are reset
       * because they are no longer valid for the new category.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<EditorState>} action - New category data
       */
      updateCategory: (state, action: PayloadAction<EditorState>) => {
        // If category changes, we reset the next value since they are now unvalid
        const reset =
          state.categoryId === action.payload.categoryId
            ? {}
            : {
                ingredientId: null,
                quantityId: null,
                quantityValue: null,
              };
        return { ...state, ...action.payload, ...reset };
      },
      /**
       * Updates the selected ingredient and resets dependent state.
       * 
       * When ingredient changes, quantity and value are reset because
       * they are specific to the previous ingredient.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<EditorState>} action - New ingredient data
       */
      updateIngredient: (state, action: PayloadAction<EditorState>) => {
        const reset =
          state.ingredientId === action.payload.ingredientId
            ? {}
            : {
                quantityId: null,
                quantityValue: null,
              };
        return { ...state, ...action.payload, ...reset };
      },
      /**
       * Updates the selected quantity and sets default value.
       * 
       * When quantity changes, the value is reset to the quantity's default
       * (based on quantity_default_number_of_units or quantity_default_weight).
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<EditorState>} action - New quantity data
       */
      updateQuantity: (state, action: PayloadAction<EditorState>) => {
        const nextState = { ...state, ...action.payload };
        const reset =
          state.quantityId === action.payload.quantityId
            ? {}
            : {
                quantityValue: getDefaultQuantityValue(nextState),
              };
        return { ...nextState, ...reset };
      },
      /**
       * Updates the quantity value without changing other state.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<EditorState>} action - New value data
       */
      updateValue: (state, action: PayloadAction<EditorState>) => {
        return { ...state, ...action.payload };
      },
      /**
       * Decreases the quantity value by the specified step.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<{step?: number}>} action - Optional step value (default: 1)
       */
      decreaseQuantityValue: (
        state,
        action: PayloadAction<{ step?: number }>
      ) => {
        if (state.quantityValue == null) {
          return state;
        }
        return {
          ...state,
          quantityValue: state.quantityValue - (action.payload.step ?? 1),
        };
      },
      /**
       * Increases the quantity value by the specified step.
       * 
       * @param {EditorState} state - Current state
       * @param {PayloadAction<{step?: number}>} action - Optional step value (default: 1)
       */
      increaseQuantityValue: (
        state,
        action: PayloadAction<{ step?: number }>
      ) => {
        if (state.quantityValue == null) {
          return state;
        }
        return {
          ...state,
          quantityValue: state.quantityValue + (action.payload.step ?? 1),
        };
      },
      /**
       * Closes the editor and resets all state to initial values.
       * Called when user cancels or successfully validates ingredient selection.
       * 
       * @returns {EditorState} Reset state with all values set to null
       */
      closeEditor: () => {
        return {
          currentView: null,
          categoryId: null,
          ingredientId: null,
          quantityId: null,
          quantityValue: null,
          modifiedIngredient: undefined,
        };
      },
      /**
       * Opens the editor and sets initial view to category selection.
       * This starts the ingredient selection state machine.
       * 
       * @returns {EditorState} Initial state with currentView set to 'category'
       */
      openEditor: () => {
        return {
          currentView: "category",
          categoryId: null,
          ingredientId: null,
          quantityId: null,
          quantityValue: null,
        };
      },
    },
  }
);

export default editor;

export const {
  updateEditorState,
  closeEditor,
  openEditor,
  updateCategory,
  updateIngredient,
  updateQuantity,
  updateValue,
  decreaseQuantityValue,
  decreaseDefaultWeight,
  increaseQuantityValue,
  increaseDefaultWeight,
} = editor.actions;
