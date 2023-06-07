import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import data from "../../data";

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
  // This identify the modified ingredient, such that we cvan delete it if validated
  modifiedIngredient?: {
    categoryId: string | null;
    ingredientId: string | null;
    quantityId: string | null;
  };
};

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
      updateEditorState: (state, action: PayloadAction<EditorState>) => {
        return { ...state, ...action.payload };
      },
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
      updateValue: (state, action: PayloadAction<EditorState>) => {
        return { ...state, ...action.payload };
      },
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
