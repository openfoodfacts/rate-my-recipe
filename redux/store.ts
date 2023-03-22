import { configureStore } from "@reduxjs/toolkit";
import recipeSlice from "./reducers/recipes";
import ingredientsSlice from "./reducers/ingredients";

export const { incremented, decremented } = recipeSlice.actions;

const store = configureStore({
  reducer: {
    recipe: recipeSlice.reducer,
    ingredients: ingredientsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
