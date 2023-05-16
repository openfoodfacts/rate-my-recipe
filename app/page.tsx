"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import IngredientSelector from "@/components/IngredientSelector";

import { useDispatch, useSelector } from "react-redux";
import { selectCurrentIngredients, selectURLParams } from "@/redux/selectors";
import { RootState } from "@/redux/store";
import IngredientCard from "@/components/IngredientCard";
import { Button, Stack } from "@mui/material";
import { openEditor } from "@/redux/reducers/editor";
import { Sheet } from "@mui/joy";
import { parseURLParameters } from "@/redux/reducers/recipes";
import ShowNutritionalTable from "@/components/ShowNutritionalTable";

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
