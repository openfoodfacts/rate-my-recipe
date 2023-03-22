"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";

import { IngredientTypes } from "@/redux/reducers/ingredients";
import SubList from "./SubList";
import { IngredientsFooter } from "./IngredientsFooter";
import { AddIngredient } from "./AddIngredient";
import { Box, IconButton } from "@mui/joy";
import Clear from "@mui/icons-material/Clear";

const ingredientTypes: IngredientTypes[] = [
  "VPO",
  "Feculent_Legumineuse_cereale",
  "legumes",
  "matiere_grasse",
  "bouillon",
  "condiment",
];

export default function IngredientList({
  recipeId,
  copy,
  remove,
}: {
  recipeId: string;
  copy: () => void;
  remove?: () => void;
}) {
  return (
    <Sheet
      sx={{
        width: 350,
        p: 2,
        mx: 1,
        height: "calc(100vh - 84px)",
        maxHeight: "calc(100vh - 84px)",
        overflowY: "auto",
        borderRadius: 8,
      }}
    >
      <Box
        sx={{
          height: 32,
          textAlign: "right",
        }}
      >
        {remove === undefined ? null : (
          <IconButton onClick={remove} size="sm" variant="plain">
            <Clear />
          </IconButton>
        )}
      </Box>
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
            <SubList ingredientType={ingredientType} recipeId={recipeId} />
          </React.Fragment>
        ))}
      </List>
      <AddIngredient recipeId={recipeId} />
      <IngredientsFooter recipeId={recipeId} copy={copy} />
    </Sheet>
  );
}
