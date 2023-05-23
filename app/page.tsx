"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import store, { RootState } from "@/redux/store";
import IngredientCard from "@/components/IngredientCard";
import { Button, Stack } from "@mui/material";
import { openEditor } from "@/redux/reducers/editor";
import { Sheet } from "@mui/joy";
import {
  parseURLParameters,
  updateRecipeIngredients,
} from "@/redux/reducers/recipes";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";

export default function Home() {
  const dispatch = useDispatch();
  const currentRecipeId = "userRecipe"; 
  const searchParams = useSearchParams();
  const params = useSelector((state: RootState) =>
    selectURLParams(state, currentRecipeId)
  );
  React.useEffect(() => {
    dispatch<any>(
      updateRecipeIngredients({
        recipeId: "userRecipe",
        type: "overideFromURLParams",
        ingredients: Array.from(searchParams.entries()).map(([key, value]) => ({
          key,
          value,
        })),
      })
    );
    // Might be better to have only one call but at least it works
    if (Array.from(searchParams.entries()).length !== 0) {
      dispatch<any>(
        updateRecipeIngredients({
          recipeId: "urlRecipe",
          type: "overideFromURLParams",
          ingredients: Array.from(searchParams.entries()).map(
            ([key, value]) => ({
              key,
              value,
            })
          ),
        })
      );
    }
  }, [dispatch, searchParams]);

  const ingrdients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, "userRecipe")
  );
  function handleShareButtonClick() {
    const url = "https://amathjourney.com/api/yololo";
  
    const ingredients = selectCurrentIngredients(store.getState(), currentRecipeId);

    const valuesAndQuantities = ingredients.flatMap((ingredient) =>
    ingredient.quantities.map((quantity) => ({
      quantity: quantity.id,
      value: quantity.value,
    }))
  );
  const body = JSON.stringify({ valuesAndQuantities });
  
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
     return data
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  
  return (
    <main
      style={{
        maxWidth: "100%",
      }}
    >
     
     <Button onClick={handleShareButtonClick}>
      Share Recipe
    </Button>
      <p>
        url:{" "}
        <a
          href={`https://splendorous-beijinho-051f54.netlify.app?${params}`}
        >{`https://splendorous-beijinho-051f54.netlify.app?${params}`}</a>
      </p>
      <Stack direction="row" flexWrap="wrap">
        {ingrdients.map((ingredient) => (
          <IngredientCard {...ingredient} key={ingredient.id} />
        ))}
      </Stack>
      <h3 style={{ padding: 20 }}>Request sent:</h3>

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

        <ShowNutritionalTable />
      </Sheet>
      <IngredientSelector />
    </main>
  );
}
