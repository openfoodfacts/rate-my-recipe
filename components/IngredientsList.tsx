"use client";

import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectCurrentIngredients } from "../redux/selectors";
import { Box, IconButton, Tooltip } from "@mui/joy";
import DeleteIcon from "@mui/icons-material/Delete";
import { removeIngredient } from "@/redux/reducers/recipes";

export default function IngredientList({ recipeId }: { recipeId?: string }) {
  const ingredients = useSelector((state: RootState) =>
    selectCurrentIngredients(state, recipeId)
  );
  const dispatch = useDispatch();
  return (
    <Sheet sx={{ width: 250, p: 2 }}>
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
        {ingredients.map(({ id, decorator }) => (
          <ListItem key={id} sx={{ justifyContent: "space-between" }}>
            <Box>
              {decorator ? (
                <ListItemDecorator>{decorator}</ListItemDecorator>
              ) : null}{" "}
              {id}
            </Box>
            <Box>
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
          </ListItem>
        ))}
      </List>
    </Sheet>
  );
}
