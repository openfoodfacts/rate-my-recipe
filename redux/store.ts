import {
  createSlice,
  configureStore,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import recipeSlice from "./reducers/recipes";
import ingredientsSlice from "./reducers/ingredients";

export const { incremented, decremented } = recipeSlice.actions;

const store = configureStore({
  reducer: {
    recipe: recipeSlice.reducer,
    ingredients: ingredientsSlice.reducer,
  },
});

// Can still subscribe to the store
store.subscribe(() => console.log(store.getState()));

export type RootState = ReturnType<typeof store.getState>;

export default store;
