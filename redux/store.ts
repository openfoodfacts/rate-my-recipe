import { configureStore } from "@reduxjs/toolkit";
import recipeSlice from "./reducers/recipes";
import editorSlice from "./reducers/editor";

const store = configureStore({
  reducer: {
    recipe: recipeSlice.reducer,
    editor: editorSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
