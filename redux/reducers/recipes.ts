import {
  createSlice,
  configureStore,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { IngredientId } from "./ingredients";

type RecipeStateType = {
  servings: number;
  ingredients: {
    id: IngredientId;
    quantity: number;
  }[];
  instructions: string[];
};

type RecipesStateType = {
  recipes: { [id: string]: RecipeStateType };
  ids: string[];
  currentRecipeId?: string;
};

type ReciepeAction<CustomT> = CustomT & { recipeId?: string };

const getRecipeId = (
  state: RecipesStateType,
  action: PayloadAction<ReciepeAction<{}>>
) => {
  const recipeId = action.payload.recipeId ?? state.currentRecipeId;
  if (recipeId === undefined) {
    throw new Error("recipeId is unfedinef");
  }
  if (state.recipes[recipeId] === undefined) {
    throw new Error(
      `recipeId "${recipeId}" does not correspond to a known receipe`
    );
  }
  return recipeId;
};

const recipeSlice = createSlice<
  RecipesStateType,
  SliceCaseReducers<RecipesStateType>,
  string
>({
  name: "recipe",
  initialState: {
    recipes: {},
    ids: [],
  },
  reducers: {
    /**
     * Adds one to the number of servings
     * @param state
     */
    incrementServings: (state, action) => {
      const recipeId = getRecipeId(state, action);
      state.recipes[recipeId].servings += 1;
    },
    /**
     * Removes one to the number of servings
     * @param state
     */
    decrementServings: (state, action) => {
      const recipeId = getRecipeId(state, action);
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
      const recipeId = getRecipeId(state, action);

      state.recipes[recipeId].ingredients = state.recipes[
        recipeId
      ].ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.ingredientId
      );
    },
    /**
     * Add the ingredient
     */
    addIngredient: (
      state,
      action: PayloadAction<ReciepeAction<{ newIngredient: any }>>
    ) => {
      const recipeId = getRecipeId(state, action);

      state.recipes[recipeId].ingredients.push(action.payload.newIngredient);
    },
    /**
     * Update the ingredient quanity
     */
    updateIngredient: (
      state,
      action: PayloadAction<
        ReciepeAction<{ ingredientId: string; quantity: number }>
      >
    ) => {
      const recipeId = getRecipeId(state, action);

      const ingredientIndex = state.recipes[recipeId].ingredients.findIndex(
        (ingredient) => ingredient.id === action.payload.ingredientId
      );
      state.recipes[recipeId].ingredients[ingredientIndex].quantity =
        action.payload.quantity;
    },
  },
});

export default recipeSlice;
