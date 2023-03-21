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

import { useDispatch } from "react-redux";

import { removeIngredient, updateIngredient } from "@/redux/reducers/recipes";
import { IngredientType } from "@/redux/reducers/ingredients";

const IngredientItem = (
  props: IngredientType & { quantity?: number; recipeId?: string }
) => {
  const {
    id,
    decorator,
    quantityUnit,
    quantityOptions,
    recipeId,
    quantity = props.quantityOptions[0],
  } = props;

  const [editValues, setEditValues] = React.useState<
    undefined | { quantity?: number }
  >(undefined);

  const dispatch = useDispatch();

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
                onClick={() => {
                  setEditValues((prev) =>
                    prev === undefined ? { quantity: quantity } : undefined
                  );
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remove">
              <IconButton
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
            <FormControl sx={{ width: 200 }}>
              <FormLabel>Quantity</FormLabel>
              <Select
                value={editValues.quantity}
                onChange={(_, newValue: number) => {
                  setEditValues((prev) => ({
                    ...prev,
                    quantity: newValue,
                  }));
                }}
              >
                {quantityOptions.map((option) => (
                  <Option value={option} key={option}>
                    {quantityUnit ? `${option} (${quantityUnit})` : option}
                  </Option>
                ))}
              </Select>
            </FormControl>
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
                  dispatch(
                    updateIngredient({
                      recipeId,
                      ingredientId: id,
                      quantity: editValues?.quantity,
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
