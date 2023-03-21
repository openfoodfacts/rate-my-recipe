import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { availableIngredients } from "../../data/ingredients";

export type IngredientId = string;
export type IngredientTypes =
  | "VPO"
  | "Feculent_Legumineuse_cereale"
  | "legumes"
  | "matiere_grasse"
  | "bouillon"
  | "condiment";

export type IngredientType = {
  id: IngredientId;
  // Type of the food.
  type: IngredientTypes;
  quantityUnit: string;
  quantityOptions: number[];
  decorator?: string;
};

// I put it in redux now, to be able latter on to download/ add new ingredients
type IngredientStateType = {
  values: { [id: string]: IngredientType };
  ids: string[];
};

const transfomedIngredients: IngredientStateType["values"] = {};
availableIngredients.forEach((ingrdient) => {
  transfomedIngredients[ingrdient.id] = ingrdient;
});

const ingredientsSlice = createSlice<
  IngredientStateType,
  SliceCaseReducers<IngredientStateType>,
  string
>({
  name: "ingredients",
  initialState: {
    values: transfomedIngredients,
    ids: Object.keys(transfomedIngredients),
  },
  reducers: {},
});

export default ingredientsSlice;
