"use client";

import * as React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Tooltip from "@mui/joy/Tooltip";
import Button from "@mui/joy/Button";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useDispatch, useSelector } from "react-redux";

import { removeIngredient, updateIngredient } from "@/redux/reducers/recipes";
import { IngredientType } from "@/redux/reducers/ingredients";
import { selectUnusedIngredients } from "@/redux/selectors";
import { RootState } from "@/redux/store";
import { availableIngredients } from "@/data/ingredients";

const IngredientItem = (
  props: IngredientType & { quantity?: number; recipeId: string }
) => {
  const {
    id,
    decorator,
    quantityUnit,
    quantityOptions,
    recipeId,
    type,
    quantity = props.quantityOptions[0],
  } = props;

  const [editValues, setEditValues] = React.useState<
    undefined | { quantityIndex: number; ingredientIndex: number }
  >(undefined);

  const unusedIngredients = useSelector((state: RootState) =>
    selectUnusedIngredients(state, type, recipeId)
  );
  const availableIngredientOptions = [
    { id, decorator, quantityUnit, quantityOptions },
    ...unusedIngredients,
  ];

  const dispatch = useDispatch();

  const currentQuantityOptions =
    editValues?.ingredientIndex === undefined
      ? quantityOptions
      : availableIngredientOptions[editValues.ingredientIndex].quantityOptions;

  const currentQuantityUnit =
    editValues?.ingredientIndex === undefined
      ? quantityUnit
      : availableIngredientOptions[editValues.ingredientIndex].quantityUnit;

  return (
    <ListItem key={id}>
      {" "}
      <Box sx={{ display: "flex", width: "100%", flexDirection: "column" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {decorator ? (
              <ListItemDecorator>{decorator}</ListItemDecorator>
            ) : null}{" "}
            {id} {quantity} {quantityUnit}
          </Box>
          <Box>
            <Tooltip title="Edit" sx={{ mr: 1 }}>
              <IconButton
                size="sm"
                onClick={() => {
                  setEditValues((prev) =>
                    prev === undefined
                      ? {
                          quantityIndex: Math.max(
                            0,
                            quantityOptions.indexOf(quantity)
                          ),
                          ingredientIndex: 0,
                        }
                      : undefined
                  );
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove">
              <IconButton
                size="sm"
                onClick={() => {
                  dispatch(removeIngredient({ ingredientId: id }));
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {editValues !== undefined && (
          <Box>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <FormControl sx={{ width: "48%" }}>
                <FormLabel>Ingredient</FormLabel>
                <Select
                  value={editValues.ingredientIndex}
                  // @ts-ignore
                  onChange={(_, newValue: number) => {
                    setEditValues((prev) => ({
                      ...prev,
                      ingredientIndex: newValue,
                      quantityIndex: 0,
                    }));
                  }}
                >
                  {availableIngredientOptions.map((option, optionIndex) => (
                    <Option value={optionIndex} key={option.id}>
                      {option.id}
                    </Option>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: 200 }}>
                <FormLabel>Quantity</FormLabel>
                <Select
                  value={editValues.quantityIndex}
                  // @ts-ignore
                  onChange={(_, newValue: number) => {
                    setEditValues((prev) =>
                      prev === undefined
                        ? prev
                        : {
                            ...prev,
                            quantityIndex: newValue,
                          }
                    );
                  }}
                >
                  {currentQuantityOptions.map((option, optionIndex) => (
                    <Option value={optionIndex} key={option}>
                      {quantityUnit
                        ? `${option} (${currentQuantityUnit})`
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
                onClick={() => setEditValues(undefined)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="soft"
                onClick={() => {
                  const newIngredientId =
                    availableIngredientOptions[editValues.ingredientIndex].id;
                  const newQuantity =
                    currentQuantityOptions[editValues?.quantityIndex];

                  dispatch(
                    updateIngredient({
                      recipeId,
                      ingredientId: id,
                      quantity: newQuantity,
                      newIngredientId,
                    })
                  );
                  setEditValues(undefined);
                }}
              >
                Validate
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </ListItem>
  );
};

export default IngredientItem;
