import { configureStore } from "@reduxjs/toolkit";
import recipeSlice from "./reducers/recipes";
import recipeV2Slice from "./reducers/recipes_v2";
import editorSlice from "./reducers/editor";
import ingredientsSlice from "./reducers/ingredients";

export const { incremented, decremented } = recipeSlice.actions;

const store = configureStore({
  reducer: {
    recipe: recipeSlice.reducer,
    recipeV2: recipeV2Slice.reducer,
    editor: editorSlice.reducer,
    ingredients: ingredientsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
