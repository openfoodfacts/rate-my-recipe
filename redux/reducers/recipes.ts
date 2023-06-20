import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import data from "../../data";

export const updateRecipeIngredients = createAsyncThunk(
  "updateIngredients",
  async (
    { recipeId, ...action }: ReciepeAction<UpdateActionType>,
    thunkAPI: any
  ) => {
    const nextIngredients = ingredientReducer(
      thunkAPI.getState().recipe.recipes[recipeId].ingredients,
      action
    );

    const ingredients = nextIngredients
      .flatMap((ingredient) => {
        const ingredientData = data.ingredients[ingredient.id];

        return ingredient.quantities.map((quantity) => {
          const quantityData = data.quantities[quantity.id];

          const isPerUnit =
            quantityData.quantity_default_weight_per_unit !== undefined;

          const weight =
            quantity.value *
            (isPerUnit ? quantityData.quantity_default_weight_per_unit! : 1);

          const ingredientName = quantityData.quantity_ingredient_name || ingredientData.ingredient_name;

          return `${ingredientName} ${weight} ${quantityData.quantity_unit!}`;
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
          tags_lc: "fr",
          fields: "ingredients,nutriments_estimated,nutriscore_grade,nutriscore_score,ecoscore_grade,ecoscore_score",
          product: {
            lang: "fr",
            categories_tags: ["Cassoulets au confit de canard"],
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
      value?: number;
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
      rep[id] = { ...rep[id], value: parseInt(value) };
    }
  });

  return rep;
}
function groupByIngredient(groupedParams: {
  [k: string]: {
    ingredientId?: string;
    quantityId?: string;
    value?: number;
  };
}) {
  const rep: { [ingredientId: string]: { q: string; v: number }[] } = {};
  Object.values(groupedParams).forEach(
    ({ ingredientId, quantityId, value }) => {
      if (
        !value ||
        isNaN(value) ||
        !ingredientId ||
        !data.ingredients[ingredientId]
      ) {
        return;
      }
      if (
        quantityId &&
        !data.ingredients[ingredientId].quantities.includes(quantityId)
      ) {
        return;
      }

      rep[ingredientId] = [
        ...(rep[ingredientId] ?? []),
        {
          q: quantityId ?? data.ingredients[ingredientId].quantities[0],
          v: value,
        },
      ];
    }
  );

  return rep;
}

export type Ingredient = {
  categoryId: string;
  id: string;
  quantities: {
    id: string;
    value: number;
  }[];
};

type RecipeStateType = {
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  ecoscore:any;
  ecoscore_100: any;
  nutriscore: any;
  nutriscore_100: any;
  nutriments: any;
};

type RecipesStateType = {
  recipes: {
    [id: string]: RecipeStateType;
    urlRecipe: RecipeStateType;
    userRecipe: RecipeStateType;
  };
  ids: string[];
};

type ReciepeAction<CustomT> = CustomT & { recipeId: string };

type UpdateActionType =
  | {
      type: "upsert";
      ingredientCategoryId: string;
      ingredientId: string;
      quantityId: string;
      quantityValue: number;
    }
  | {
      type: "delete";
      ingredientId: string;
      quantityId: string;
    }
  | {
      type: "overideFromURLParams";
      ingredients: {
        key: string;
        value: string;
      }[];
    };

const ingredientReducer = (
  ingredients: Ingredient[],
  action: UpdateActionType
): Ingredient[] => {
  if (action.type === "upsert") {
    const {
      ingredientCategoryId: ingredientCategoryId,
      ingredientId,
      quantityId,
      quantityValue,
    } = action;
    const ingredientIndex = ingredients.findIndex(
      ({ id, categoryId }) =>
        ingredientId === id && categoryId === ingredientCategoryId
    );
    if (ingredientIndex === -1) {
      return [
        ...ingredients,
        {
          id: ingredientId,
          categoryId: ingredientCategoryId,
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
  if (action.type === "overideFromURLParams") {
    const groupedParams = groupByIngredient(groupURLParams(action.ingredients));

    const ingredients = Object.entries(groupedParams).map(
      ([ingredientId, quantities]) => {
        return {
          categoryId: data.ingredients[ingredientId].category_id,
          id: ingredientId,
          quantities: quantities.map(({ q, v }) => ({ id: q, value: v })),
        };
      }
    );
    return ingredients;
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

const recipeSlice = createSlice<
  RecipesStateType,
  SliceCaseReducers<RecipesStateType>,
  string
>({
  name: "recipe",
  initialState: {
    recipes: {
      urlRecipe: {
        ingredients: [],
        servings: 4,
        instructions: [],
        ecoscore: null,
        ecoscore_100: null,        
        nutriscore: null,
        nutriscore_100: null,
        nutriments: {},
      },
      userRecipe: {
        ingredients: [],
        servings: 4,
        instructions: [],
        ecoscore: null,
        ecoscore_100: null,         
        nutriscore: null,
        nutriscore_100: null,
        nutriments: {},
      },
    },
    ids: ["urlRecipe", "userRecipe"],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateRecipeIngredients.pending, (state, action) => {
      const { recipeId } = action.meta.arg;
      state.recipes[recipeId].ingredients = ingredientReducer(
        state.recipes[recipeId].ingredients,
        action.meta.arg
      );
    });

    builder.addCase(updateRecipeIngredients.fulfilled, (state, action) => {
      const { recipeId } = action.meta.arg;

      if (!action.payload.product.nutriscore_grade) {
        console.error(action.payload);
      }
      const { ecoscore_grade, ecoscore_score, nutriscore_grade, nutriscore_score, nutriments_estimated } = action.payload.product;

      state.recipes[recipeId].ecoscore = ecoscore_grade;
      state.recipes[recipeId].ecoscore_100 = ecoscore_score;

      state.recipes[recipeId].nutriscore = nutriscore_grade;
      // nutriscore_score goes from -15 to 42, compute nutriscore_100 on a 0 to 100 scale, 100 being the best
      state.recipes[recipeId].nutriscore_100 = Math.round(100 - (nutriscore_score + 15) / 57 * 100);
      state.recipes[recipeId].nutriments = nutriments_estimated;
    });
  },
});

export default recipeSlice;

export const { upsetIngredient, removeIngredient, parseURLParameters } =
  recipeSlice.actions;
