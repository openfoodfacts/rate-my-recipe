"use client";

import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectCurrentIngredients,
  selectUnusedIngredients,
} from "@/redux/selectors";
import { addIngredient } from "@/redux/reducers/recipes";
import { IngredientTypes } from "@/redux/reducers/ingredients";

import IngredientItem from "./IngredientItem";

const SubList = ({
  ingredientType,
  recipeId,
}: {
  recipeId?: string;
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

  return (
    <React.Fragment>
      {displayedIngredients.map((ingredient) => (
        <IngredientItem
          key={ingredient.id}
          {...ingredient}
          recipeId={recipeId}
        />
      ))}
      {ingredientAddtition === undefined ? (
        <Button
          disabled={unusedIngredients.length === 0}
          onClick={() => {
            setIngredientAddtition({
              ingredientIndex: 0,
              quantityIndex: 0,
            });
          }}
          sx={{ mb: 2, mt: 4 }}
          variant="outlined"
        >
          Add Ingredient
        </Button>
      ) : (
        <Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <FormControl sx={{ width: "48%" }}>
              <FormLabel>Ingredient</FormLabel>
              <Select
                value={ingredientAddtition.ingredientIndex}
                // @ts-ignore
                onChange={(_, newValue: number) => {
                  setIngredientAddtition((prev) => ({
                    ...prev,
                    ingredientIndex: newValue,
                    quantityIndex: 0,
                  }));
                }}
              >
                {unusedIngredients.map((option, optionIndex) => (
                  <Option value={optionIndex} key={option.id}>
                    {option.id}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "48%" }}>
              <FormLabel>Quantity</FormLabel>
              <Select
                value={ingredientAddtition.quantityIndex}
                // @ts-ignore
                onChange={(_, newValue: number) => {
                  setIngredientAddtition((prev) => ({
                    ingredientIndex: 0, // to remove (here to satisfy TS)
                    ...prev,
                    quantityIndex: newValue,
                  }));
                }}
              >
                {unusedIngredients[
                  ingredientAddtition.ingredientIndex
                ].quantityOptions.map((option, optionIndex) => (
                  <Option value={optionIndex} key={option}>
                    {unusedIngredients[ingredientAddtition.ingredientIndex]
                      .quantityUnit
                      ? `${option} (${
                          unusedIngredients[ingredientAddtition.ingredientIndex]
                            .quantityUnit
                        })`
                      : option}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: 2, display: "flex" }}>
            <Button
              fullWidth
              sx={{ mr: 2 }}
              variant="soft"
              color="neutral"
              onClick={() => setIngredientAddtition(undefined)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="soft"
              onClick={() => {
                dispatch(
                  addIngredient({
                    recipeId,
                    ingredientId:
                      unusedIngredients[ingredientAddtition.ingredientIndex].id,
                    quantity:
                      unusedIngredients[ingredientAddtition.ingredientIndex]
                        .quantityOptions[ingredientAddtition.quantityIndex],
                  })
                );
                setIngredientAddtition(undefined);
              }}
            >
              Validate
            </Button>
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default SubList;
