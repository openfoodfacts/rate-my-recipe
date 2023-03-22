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
    quantity?: number;
  }[];
  instructions: string[];
};

type RecipesStateType = {
  recipes: { [id: string]: RecipeStateType };
  ids: string[];
  currentRecipeId?: string;
};

type ReciepeAction<CustomT> = CustomT & { recipeId: string };

const recipeSlice = createSlice<
  RecipesStateType,
  SliceCaseReducers<RecipesStateType>,
  string
>({
  name: "recipe",
  initialState: {
    recipes: {
      empty_recipe: {
        ingredients: [{ id: "chicken" }, { id: "porc" }],
        servings: 4,
        instructions: [],
      },
    },
    ids: ["empty_recipe"],
    currentRecipeId: "empty_recipe",
  },
  reducers: {
    /**
     * Adds one to the number of servings
     * @param state
     */
    incrementServings: (state, action) => {
      const recipeId = action.payload.recipeId;
      state.recipes[recipeId].servings += 1;
    },
    /**
     * Removes one to the number of servings
     * @param state
     */
    decrementServings: (state, action) => {
      const recipeId = action.payload.recipeId;
      state.recipes[recipeId].servings = Math.max(
        1,
        state.recipes[recipeId].servings
      );
    },
    /**
     * Remove the ingredient with the given id
     */
    removeIngredient: (
      state,
      action: PayloadAction<ReciepeAction<{ ingredientId: string }>>
    ) => {
      const { recipeId, ingredientId } = action.payload;

      state.recipes[recipeId].ingredients = state.recipes[
        recipeId
      ].ingredients.filter((ingredient) => ingredient.id !== ingredientId);
    },
    /**
     * Add the ingredient
     */
    addIngredient: (
      state,
      action: PayloadAction<
        ReciepeAction<{ ingredientId: string; quantity: number }>
      >
    ) => {
      const { recipeId, ingredientId, quantity } = action.payload;

      state.recipes[recipeId].ingredients.push({
        id: ingredientId,
        quantity,
      });
    },
    /**
     * Update the ingredient quanity
     */
    updateIngredient: (
      state,
      action: PayloadAction<
        ReciepeAction<{
          ingredientId: string;
          quantity: number;
          newIngredientId?: string;
        }>
      >
    ) => {
      const { recipeId, quantity, ingredientId, newIngredientId } =
        action.payload;

      const ingredientIndex = state.recipes[recipeId].ingredients.findIndex(
        (ingredient) => ingredient.id === ingredientId
      );
      state.recipes[recipeId].ingredients[ingredientIndex].quantity = quantity;
      state.recipes[recipeId].ingredients[ingredientIndex].id =
        newIngredientId ?? ingredientId;
    },
    /**
     * Copy a recipe
     */
    copyRecipe: (
      state,
      action: PayloadAction<ReciepeAction<{ createdId: string }>>
    ) => {
      const { recipeId, createdId } = action.payload;

      state.recipes[createdId] = state.recipes[recipeId];
      state.ids.push(createdId);
    },
  },
});

export default recipeSlice;

export const {
  incrementServings,
  decrementServings,
  removeIngredient,
  addIngredient,
  updateIngredient,
  copyRecipe,
} = recipeSlice.actions;
