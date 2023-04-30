import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { IngredientId } from "./ingredients";
import data from "../../data/ingredient_taxonomy.json";
import { DataType } from "./editor";

export const INGREDIENT = "i";
export const QUANTITY = "q";
export const VALUE = "v";

function groupURLParams(params: { key: string; value: string }[]) {
  const rep: {
    [k: string]: {
      ingredientId?: string;
      quantityId?: string;
      value?: string;
    };
  } = {};

  params.forEach(({ key, value }) => {
    if (key.startsWith(INGREDIENT)) {
      const id = key.slice(INGREDIENT.length);
      rep[id] = { ...rep[id], ingredientId: value };
    }
    if (key.startsWith(QUANTITY)) {
      const id = key.slice(QUANTITY.length);
      rep[id] = { ...rep[id], quantityId: value };
    }
    if (key.startsWith(VALUE)) {
      const id = key.slice(VALUE.length);
      rep[id] = { ...rep[id], value };
    }
  });

  return rep;
}
function groupByIngredient(groupedParams: {
  [k: string]: {
    ingredientId?: string;
    quantityId?: string;
    value?: string;
  };
}) {
  const rep: { [ingredientId: string]: { q: string; v: number }[] } = {};
  Object.values(groupedParams).forEach(
    ({ ingredientId, quantityId, value }) => {
      if (
        !value ||
        isNaN(parseInt(value)) ||
        !ingredientId ||
        !INGREDIENT_TO_TYPE[ingredientId]
      ) {
        return;
      }
      if (
        quantityId &&
        !INGREDIENT_TO_TYPE[ingredientId].quantities.includes(quantityId)
      ) {
        return;
      }

      rep[ingredientId] = [
        ...(rep[ingredientId] ?? []),
        {
          q: quantityId ?? INGREDIENT_TO_TYPE[ingredientId].quantities[0],
          v: parseInt(value),
        },
      ];
    }
  );

  return rep;
}

const INGREDIENT_TO_TYPE: {
  [k: string]: { quantities: string[]; typeId: string };
} = {};
(data as DataType).forEach((type) => {
  const typeId = type["Ingredient type id"];
  type.ingredients.forEach((ingredient) => {
    const ingredientId = ingredient["Ingredient id"];
    const quantities = ingredient.quantities.map((q) => q["Quantity id"]);
    INGREDIENT_TO_TYPE[ingredientId] = { quantities, typeId };
  });
});

export type Ingredient = {
  typeId: string;
  id: IngredientId;
  quantities: {
    id: string;
    value: number;
  }[];
};

type RecipeStateType = {
  servings: number;
  ingredients: Ingredient[];
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
        ingredients: [
          {
            typeId: "ingredient-principal",
            id: "chicken",
            quantities: [
              {
                id: "whole-chicken",
                value: 1,
              },
              {
                id: "chicken-thigh",
                value: 2,
              },
            ],
          },
        ],
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
          ingredientTypeId: string;
          ingredientId: string;
          quantityId: string;
          quantityValue: number;
        }>
      >
    ) => {
      const {
        recipeId,
        ingredientTypeId,
        ingredientId,
        quantityId,
        quantityValue,
      } = action.payload;

      const ingredientIndex = state.recipes[recipeId].ingredients.findIndex(
        ({ id, typeId }) => ingredientId === id && typeId === ingredientTypeId
      );
      if (ingredientIndex === -1) {
        state.recipes[recipeId].ingredients.push({
          id: ingredientId,
          typeId: ingredientTypeId,
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

    parseURLParameters: (
      state,
      action: PayloadAction<
        ReciepeAction<{
          params: any[];
        }>
      >
    ) => {
      const { recipeId, params } = action.payload;
      const groupedParams = groupByIngredient(groupURLParams(params));

      const ingredients = Object.entries(groupedParams).map(
        ([ingredientId, quantities]) => {
          return {
            typeId: INGREDIENT_TO_TYPE[ingredientId].typeId,
            id: ingredientId,
            quantities: quantities.map(({ q, v }) => ({ id: q, value: v })),
          };
        }
      );

      state.recipes[recipeId].ingredients = ingredients;
    },
  },
});

export default recipeSlicev2;

export const { upsetIngredient, removeIngredient, parseURLParameters } =
  recipeSlicev2.actions;
