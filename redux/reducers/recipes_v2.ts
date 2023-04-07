import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { IngredientId } from "./ingredients";

type RecipeStateType = {
  servings: number;
  ingredients: {
    id: IngredientId;
    quantities: {
      id: string;
      value: number;
    }[];
  }[];
  instructions: string[];
};

type RecipesStateType = {
  recipes: { [id: string]: RecipeStateType };
  ids: string[];
};

type ReciepeAction<CustomT> = CustomT & { recipeId: string };

const recipeSlicev2 = createSlice<
  RecipesStateType,
  SliceCaseReducers<RecipesStateType>,
  string
>({
  name: "recipe_v2",
  initialState: {
    recipes: {
      empty_recipe: {
        ingredients: [],
        servings: 4,
        instructions: [],
      },
    },
    ids: ["empty_recipe"],
  },
  reducers: {
    
    upsetIngredient: (
      state,
      action: PayloadAction<
        ReciepeAction<{
          ingredientId: string;
          quantityId: string;
          quantityValue: number;
        }>
      >
    ) => {
      const { recipeId, ingredientId, quantityId, quantityValue } =
        action.payload;

      const ingredientIndex = state.recipes[recipeId].ingredients.findIndex(
        ({ id }) => ingredientId === id
      );
      if (ingredientIndex === -1) {
        state.recipes[recipeId].ingredients.push({
          id: ingredientId,
          quantities: [{ id: quantityId, value: quantityValue }],
        });
        return;
      }

      const quantityIndex = state.recipes[recipeId].ingredients[
        ingredientIndex
      ].quantities.findIndex(({ id }) => quantityId === id);

      if (quantityIndex < 0) {
        state.recipes[recipeId].ingredients[ingredientIndex].quantities.push({
          id: quantityId,
          value: quantityValue,
        });
      } else {
        state.recipes[recipeId].ingredients[ingredientIndex].quantities[
          quantityIndex
        ].value = quantityValue;
      }
    },
    /**
     * Remove the ingredient with the given id
     */
    removeIngredient: (
      state,
      action: PayloadAction<
        ReciepeAction<{ ingredientId: string; quantityId: string }>
      >
    ) => {
      const { recipeId, ingredientId, quantityId } = action.payload;

      const ingredientIndex = state.recipes[recipeId].ingredients.findIndex(
        ({ id }) => ingredientId === id
      );
      if (ingredientIndex === -1) {
        return;
      }
      state.recipes[recipeId].ingredients[ingredientIndex].quantities =
        state.recipes[recipeId].ingredients[ingredientIndex].quantities.filter(
          ({ id }) => quantityId !== id
        );
    },
  },
});

export default recipeSlicev2;

export const { upsetIngredient, removeIngredient } = recipeSlicev2.actions;
