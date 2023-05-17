import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";

import recipeSlice from "./reducers/recipes";
import editorSlice from "./reducers/editor";


export const { incremented, decremented } = recipeSlice.actions;
const logger = createLogger({
  collapsed: true,
});

const store = configureStore({
  reducer: {
    recipe: recipeSlice.reducer,
    editor: editorSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});


export type RootState = ReturnType<typeof store.getState>;

export default store;
