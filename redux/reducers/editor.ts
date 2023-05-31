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

  // TODO: clarify how to do the distinction betwee beef which is given by gramms, and chicken wings which are units
  return currentQuantity.quantity_default_number_of_units
    ? Number(currentQuantity.quantity_default_number_of_units)
    : 1;
};

export type ViewsTypes = "type" | "ingredient" | "quantity" | "value";

type EditorState = {
  currentView: null | ViewsTypes;
  typeId?: string | null;
  ingredientId?: string | null;
  quantityId?: string | null;
  quantityValue?: number | null;
  weight?: number | null;
  // This identify the modified ingredient, such that we cvan delete it if validated
  modifiedIngredient?: {
    typeId: string | null;
    ingredientId: string | null;
    quantityId: string | null;
  };
};

const editor = createSlice<EditorState, SliceCaseReducers<EditorState>, string>(
  {
    name: "editor",
    initialState: {
      currentView: null,
      typeId: null,
      ingredientId: null,
      quantityId: null,
      quantityValue: null,
      weight:500
    },
    reducers: {
      updateEditorState: (state, action: PayloadAction<EditorState>) => {
        return { ...state, ...action.payload };
      },
      updateType: (state, action: PayloadAction<EditorState>) => {
        // If type change, we reset the next value since they are now unvalid
        const reset =
          state.typeId === action.payload.typeId
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
      decreaseQuantityValue: (state) => {
        if (state.quantityValue == null) {
          return state;
        }
        return { ...state, quantityValue: state.quantityValue - 1 };
      },
      increaseQuantityValue: (state) => {
        if (state.quantityValue == null) {
          return state;
        }
        return { ...state, quantityValue: state.quantityValue + 1 };
      },
      decreaseDefaultWeight : (state) => {
        if (state.weight == null) {
          return state;
        }
        return { ...state, weight: state.weight - 1 };
      },
      increaseDefaultWeight:(state) =>{
        if (state.weight == null) {
          return state;
        }
        return { ...state, weight: state.weight + 1 };
      },

      closeEditor: () => {
        return {
          currentView: null,
          typeId: null,
          ingredientId: null,
          quantityId: null,
          quantityValue: null,
          modifiedIngredient: undefined,
        };
      },
      openEditor: () => {
        return {
          currentView: "type",
          typeId: null,
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
  updateType,
  updateIngredient,
  updateQuantity,
  updateValue,
  decreaseQuantityValue,
  decreaseDefaultWeight,
  increaseQuantityValue,
  increaseDefaultWeight
} = editor.actions;
