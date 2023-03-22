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
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { List, ListItem, Typography } from "@mui/joy";

const ingredientTypes: IngredientTypes[] = [
  "VPO",
  "Feculent_Legumineuse_cereale",
  "legumes",
  "matiere_grasse",
  "bouillon",
  "condiment",
];

export const AddIngredient = ({ recipeId }: { recipeId: string }) => {
  const unusedIngredients = useSelector((state: RootState) =>
    selectUnusedIngredients(state, "", recipeId)
  );
  const dispatch = useDispatch();

  const [ingredientAddtition, setIngredientAddtition] = React.useState<
    undefined | { ingredientIndex: number; quantityIndex: number }
  >(undefined);

  if (ingredientAddtition === undefined) {
    return (
      <Button
        fullWidth
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
    );
  }

  return (
    <Box>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <FormControl sx={{ width: "48%" }}>
          <FormLabel>Ingredient</FormLabel>
          <Select
            value={unusedIngredients[ingredientAddtition.ingredientIndex].id}
            // @ts-ignore
            onChange={(_, newValue: string) => {
              setIngredientAddtition((prev) => ({
                ...prev,
                ingredientIndex: unusedIngredients
                  .map(({ id }) => id)
                  .indexOf(newValue),
                quantityIndex: 0,
              }));
            }}
          >
            {ingredientTypes.flatMap((sectionType) => {
              const ingredientsOptions = unusedIngredients.filter(
                ({ type }) => type === sectionType
              );
              return (
                <List
                  aria-labelledby={`select-group-${name}`}
                  sx={{ "--ListItemDecorator-size": "28px" }}
                >
                  <ListItem id={`select-group-${name}`} sticky>
                    <Typography
                      level="body3"
                      textTransform="uppercase"
                      letterSpacing="md"
                    >
                      {sectionType} ({ingredientsOptions.length})
                    </Typography>
                  </ListItem>
                  {unusedIngredients.map((option) => (
                    <Option value={option.id} key={option.id}>
                      {option.decorator && (
                        <ListItemDecorator>
                          {option.decorator}
                        </ListItemDecorator>
                      )}{" "}
                      {option.id}
                    </Option>
                  ))}
                </List>
              );
            })}
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
  );
};
