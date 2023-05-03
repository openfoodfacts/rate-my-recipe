"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { copyRecipe } from "@/redux/reducers/recipes";
import {
  selectCurrentIngredients,
  selectURLParams,
} from "@/redux/selectors_v2";
import { RootState } from "@/redux/store";
import ingredientsSlice from "@/redux/reducers/ingredients";
import IngredientCard from "@/components/IngredientCardV3";
import { Button, Stack } from "@mui/material";
import { DataType, openEditor } from "@/redux/reducers/editor";
import { Sheet } from "@mui/joy";
import { parseURLParameters } from "@/redux/reducers/recipes_v2";
import data from "../../data/ingredient_taxonomy.json";

export default function Home() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();
  const params = useSelector((state: RootState) =>
    selectURLParams(state, "empty_recipe")
  );
  React.useEffect(() => {
    dispatch(
      parseURLParameters({
        recipeId: "empty_recipe",
        params: Array.from(searchParams.entries()).map(([key, value]) => ({
          key,
          value,
        })),
      })
    );
  }, [dispatch, searchParams]);

  const ingrdients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "empty_recipe")
  );

  return (
    <main
      style={{
        maxWidth: "100%",
      }}
    >
      <p>
        url:{" "}
        <a
          href={`https://splendorous-beijinho-051f54.netlify.app/v3?${params}`}
        >{`https://splendorous-beijinho-051f54.netlify.app/v3?${params}`}</a>
      </p>
      <Stack direction="row" flexWrap="wrap">
        {ingrdients.map((ingredient) => (
          <IngredientCard {...ingredient} key={ingredient.id} />
        ))}
      </Stack>
      <h3 style={{ padding: 20 }}>Request sent:</h3>
      <pre style={{ paddingLeft: 50 }}>
        {"To: https://world.openfoodfacts.dev/api/v3/product/test\n\n"}
        body:{" "}
        {JSON.stringify(
          {
            lc: "en",
            fields: "ingredients,nutriments_estimated,nutriscore_grade",
            product: {
              categories_tags: ["fruits"],
              ingredients_text_en: ingrdients
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
                      (isPerUnit
                        ? parseInt(quantityData.default_weight_per_unit)
                        : 1);

                    return `${ingredientData.Ingredient} ${weight}g`;
                  });
                })
                .join(", "),
            },
          },
          null,
          2
        )}
      </pre>
      <Sheet
        sx={{
          p: 2,
          position: "fixed",
          bottom: 0,
          width: "100%",
          textAlign: "center",
        }}
      >
        <Button sx={{ px: 5 }} onClick={() => dispatch(openEditor({}))}>
          Add Ingredient
        </Button>
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
