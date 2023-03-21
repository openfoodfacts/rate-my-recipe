"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { selectCurrentIngredients } from "@/redux/selectors";

import { IngredientTypes } from "@/redux/reducers/ingredients";
import SubList from "./SubList";

const ingredientTypes: IngredientTypes[] = [
  "VPO",
  "Feculent_Legumineuse_cereale",
  "legumes",
  "matiere_grasse",
  "bouillon",
  "condiment",
];

export default function IngredientList({ recipeId }: { recipeId?: string }) {
  const ingredients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, recipeId)
  );

  return (
    <Sheet sx={{ width: 450, p: 2 }}>
      <Typography
        id="decorated-list-demo"
        level="body3"
        textTransform="uppercase"
        fontWeight="lg"
        mb={1}
      >
        Ingredients
      </Typography>
      <List
        aria-labelledby="decorated-list-demo"
        sx={{ "--List-decoratorSize": "32px" }}
      >
        {ingredientTypes.map((ingredientType) => (
          <React.Fragment key={ingredientType}>
            <ListItem>{ingredientType}</ListItem>
            <SubList ingredientType={ingredientType} recipeId={recipeId} />
          </React.Fragment>
        ))}
      </List>
    </Sheet>
  );
}
