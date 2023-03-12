"use client";

import * as React from "react";
import Card from "@mui/joy/Card";

import Typography from "@mui/joy/Typography";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  selectCurrentIngredientsIds,
  selectAvailableIngredients,
} from "../redux/selectors";
import { Box, Button, IconButton, Tooltip } from "@mui/joy";
import { addIngredient, removeIngredient } from "@/redux/reducers/recipes";

import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IngredientTypes } from "@/redux/reducers/ingredients";

const ingredientTypes: IngredientTypes[] = [
  "VPO",
  "Feculent_Legumineuse_cereale",
  "legumes",
  "matiere_grasse",
  "bouillon",
  "condiment",
];

const useIngredientType = () => {
  const [ingredientTypeIndex, setIngredientTypeIndex] = React.useState(0);

  const next = React.useCallback(
    () =>
      setIngredientTypeIndex((prev) =>
        Math.min(prev + 1, ingredientTypes.length - 1)
      ),
    []
  );
  const prev = React.useCallback(
    () => setIngredientTypeIndex((prev) => Math.max(prev - 1, 0)),
    []
  );
  const diasbalePrev = ingredientTypeIndex === 0;
  const diasbaleNext = ingredientTypeIndex === ingredientTypes.length - 1;
  const ingredientType = ingredientTypes[ingredientTypeIndex];
  return { ingredientType, next, prev, diasbalePrev, diasbaleNext };
};

export default function IngredientSelector({
  recipeId,
}: {
  recipeId?: string;
}) {
  const { ingredientType, next, prev, diasbalePrev, diasbaleNext } =
    useIngredientType();
  const ingredientsUsed = useSelector((state: RootState) =>
    selectCurrentIngredientsIds(state, recipeId)
  );
  const ingredientsAvailable = useSelector((state: RootState) =>
    selectAvailableIngredients(state, ingredientType)
  );

  const dispatch = useDispatch();
  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          width: 600,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tooltip title="previouse step">
          <IconButton disabled={diasbalePrev} onClick={prev}>
            <ArrowBackIosRoundedIcon />
          </IconButton>
        </Tooltip>
        <Typography
          id="decorated-list-demo"
          level="body3"
          textTransform="uppercase"
          fontWeight="lg"
          mb={1}
        >
          {ingredientType}
        </Typography>
        <Tooltip title="next step">
          <IconButton disabled={diasbaleNext} onClick={next}>
            <ArrowForwardIosRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        component="ul"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 220px)",
          gap: "10px",
        }}
      >
        {ingredientsAvailable.map(({ id, type, decorator }) => {
          const isInTheRecipe = ingredientsUsed.includes(id);

          return (
            <Card
              variant="outlined"
              sx={{
                width: 220,
                height: 150,
              }}
              component="li"
              key={id}
            >
              {decorator} {id}
              <Button
                sx={{ mt: "auto" }}
                variant={isInTheRecipe ? "solid" : "soft"}
                onClick={() => {
                  if (isInTheRecipe) {
                    dispatch(removeIngredient({ ingredientId: id }));
                  } else {
                    dispatch(addIngredient({ newIngredient: { id } }));
                  }
                }}
              >
                {isInTheRecipe ? "Retirer" : "Ajouter"}
              </Button>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
