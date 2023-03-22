"use client";

import * as React from "react";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectCurrentIngredients,
  selectUnusedIngredients,
} from "@/redux/selectors";
import { IngredientTypes } from "@/redux/reducers/ingredients";

import IngredientItem from "./IngredientItem";
import ListItem from "@mui/joy/ListItem";

const SubList = ({
  ingredientType,
  recipeId,
}: {
  recipeId: string;
  ingredientType: IngredientTypes;
}) => {
  const ingredients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, recipeId)
  );
  const unusedIngredients = useSelector((state: RootState) =>
    selectUnusedIngredients(state, ingredientType, recipeId)
  );
  const dispatch = useDispatch();

  const displayedIngredients = React.useMemo(
    () =>
      ingredients.filter((ingredient) => ingredient.type === ingredientType),
    [ingredientType, ingredients]
  );

  const [ingredientAddtition, setIngredientAddtition] = React.useState<
    undefined | { ingredientIndex: number; quantityIndex: number }
  >(undefined);

  if (displayedIngredients.length === 0) {
    return null;
  }
  return (
    <React.Fragment>
      <ListItem>{ingredientType}</ListItem>
      {displayedIngredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          {...ingredient}
          recipeId={recipeId}
        />
      ))}
    </React.Fragment>
  );
};

export default SubList;
