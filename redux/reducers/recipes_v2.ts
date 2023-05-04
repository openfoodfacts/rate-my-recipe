import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { IngredientId } from "./ingredients";
import data from "../../data/ingredient_taxonomy.json";
import { DataType } from "./editor";

export const updateRecipeIngredients = createAsyncThunk(
  "updateIngredients",
  async (action: UpdateActionType, thunkAPI: any) => {
    const nextIngredients = ingredientReducer(
      thunkAPI.getState().recipeV2.recipes["empty_recipe"].ingredients,
      action
    );

    const ingredients = nextIngredients
      .flatMap((ingredient) => {
        const ingredientType = (data as DataType).find(
          (type) => type["Ingredient type id"] === ingredient.typeId
        )!;
        const ingredientData = ingredientType.ingredients.find(
          (ing) => ing["Ingredient id"] === ingredient.id
        )!;

        return ingredient.quantities.map((quantity) => {
          const quantityData = ingredientData.quantities.find(
            (q) => q["Quantity id"] === quantity.id
          )!;
          const isPerUnit = !!quantityData.default_weight_per_unit;

          const weight =
            quantity.value *
            (isPerUnit ? parseInt(quantityData.default_weight_per_unit) : 1);

          return `${ingredientData.Ingredient} ${weight}g`;
        });
      })
      .join(", ");

    var headers = new Headers({
      Authorization: `Basic off:off`,
      "Content-type": "application/json; charset=UTF-8",
    });

    const rep = await fetch(
      "https://world.openfoodfacts.dev/api/v3/product/test",
      {
        method: "PATCH",
        body: JSON.stringify({
          lc: "fr",
          fields: "ingredients,nutriments_estimated,nutriscore_grade",
          product: {
            lang: "fr",
            categories_tags: ["fruits"],
            ingredients_text_fr: ingredients,
          },
        }),
        headers,
      }
    );
    const answer = await rep.json();

    return answer;
  }
);

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
  nutriscore: any;
  nutriments: any;
};

type RecipesStateType = {
  recipes: { [id: string]: RecipeStateType };
  ids: string[];
};

type ReciepeAction<CustomT> = CustomT & { recipeId: string };

type UpdateActionType =
  | {
      type: "upsert";
      ingredientTypeId: string;
      ingredientId: string;
      quantityId: string;
      quantityValue: number;
    }
  | {
      type: "delete";
      ingredientId: string;
      quantityId: string;
    };

const ingredientReducer = (
  ingredients: Ingredient[],
  action: UpdateActionType
): Ingredient[] => {
  if (action.type === "upsert") {
    const { ingredientTypeId, ingredientId, quantityId, quantityValue } =
      action;
    const ingredientIndex = ingredients.findIndex(
      ({ id, typeId }) => ingredientId === id && typeId === ingredientTypeId
    );
    if (ingredientIndex === -1) {
      return [
        ...ingredients,
        {
          id: ingredientId,
          typeId: ingredientTypeId,
          quantities: [{ id: quantityId, value: quantityValue }],
        },
      ];
    }

    const quantityIndex = ingredients[ingredientIndex].quantities.findIndex(
      ({ id }) => quantityId === id
    );
    const defaultizedQuantityIndex =
      quantityIndex < 0
        ? ingredients[ingredientIndex].quantities.length
        : quantityIndex;

    return [
      ...ingredients.slice(0, ingredientIndex),
      {
        ...ingredients[ingredientIndex],
        quantities: [
          ...ingredients[ingredientIndex].quantities.slice(
            0,
            defaultizedQuantityIndex
          ),
          {
            id: quantityId,
            value: quantityValue,
          },
          ...ingredients[ingredientIndex].quantities.slice(
            defaultizedQuantityIndex + 1
          ),
        ],
      },

      ...ingredients.slice(ingredientIndex + 1),
    ];
  }

  const { ingredientId, quantityId } = action;

  const ingredientIndex = ingredients.findIndex(
    ({ id }) => ingredientId === id
  );
  if (ingredientIndex === -1) {
    return ingredients;
  }

  return [
    ...ingredients.slice(0, ingredientIndex),
    {
      ...ingredients[ingredientIndex],
      quantities: ingredients[ingredientIndex].quantities.filter(
        ({ id }) => quantityId !== id
      ),
    },
    ...ingredients.slice(ingredientIndex + 1),
  ];
};

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
        nutriscore: null,
        nutriments: {},
      },
    },
    ids: ["empty_recipe"],
  },
  reducers: {
    // upsetIngredient: (
    //   state,
    //   action: PayloadAction<
    //     ReciepeAction<{
    //       ingredientTypeId: string;
    //       ingredientId: string;
    //       quantityId: string;
    //       quantityValue: number;
    //     }>
    //   >
    // ) => {
    //   const {
    //     recipeId,
    //     ingredientTypeId,
    //     ingredientId,
    //     quantityId,
    //     quantityValue,
    //   } = action.payload;

    //   state.recipes[recipeId].ingredients = ingredientReducer(
    //     state.recipes[recipeId].ingredients,
    //     {
    //       type: "upsert",
    //       ingredientTypeId,
    //       ingredientId,
    //       quantityId,
    //       quantityValue,
    //     }
    //   );
    // },

    // /**
    //  * Remove the ingredient with the given id
    //  */
    // removeIngredient: (
    //   state,
    //   action: PayloadAction<
    //     ReciepeAction<{ ingredientId: string; quantityId: string }>
    //   >
    // ) => {
    //   const { recipeId, ingredientId, quantityId } = action.payload;

    //   state.recipes[recipeId].ingredients = ingredientReducer(
    //     state.recipes[recipeId].ingredients,
    //     {
    //       type: "delete",
    //       ingredientId,
    //       quantityId,
    //     }
    //   );
    // },

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
  extraReducers: (builder) => {
    builder.addCase(updateRecipeIngredients.pending, (state, action) => {
      state.recipes["empty_recipe"].ingredients = ingredientReducer(
        state.recipes["empty_recipe"].ingredients,
        action.meta.arg
      );
    });

    builder.addCase(updateRecipeIngredients.fulfilled, (state, action) => {
      if (!action.payload.product.nutriscore_grade) {
        console.error(action.payload);
      }
      state.recipes["empty_recipe"].nutriscore =
        action.payload.product.nutriscore_grade;
      state.recipes["empty_recipe"].nutriments =
        action.payload.product.nutriments_estimated;
    });
  },
});

export default recipeSlicev2;

export const { upsetIngredient, removeIngredient, parseURLParameters } =
  recipeSlicev2.actions;
