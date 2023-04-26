import * as React from "react";
import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";

import { useDispatch } from "react-redux";

import {
  Ingredient,
  removeIngredient,
  upsetIngredient,
} from "@/redux/reducers/recipes_v2";

import data from "../data/ingredient_taxonomy.json";
import {
  DataType,
  Ingredients,
  Type,
  updateEditorState,
} from "@/redux/reducers/editor";

const IngredientCard = (props: Ingredient) => {
  const { id, typeId, quantities } = props;

  const dispatch = useDispatch();

  const typeIndex = (data as DataType).findIndex(
    (type: Type) => type["Ingredient type id"] === typeId
  );

  const ingredientData: Ingredients = (data as DataType)[
    typeIndex
  ].ingredients.find(
    (ingredient: Ingredients) => ingredient["Ingredient id"] === id
  )!;

  const quantitiesData = quantities.map(({ id: quantityId, value }) => ({
    ...ingredientData.quantities.find((q) => q["Quantity id"] === quantityId),
    id,
    value,
  }));

  return (
    <React.Fragment>
      {quantitiesData.map((quantity) => (
        <Card
          variant="outlined"
          sx={{ width: 320 }}
          key={quantity["Quantity id"]}
        >
          <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
            {ingredientData["Ingredient"]}
          </Typography>
          <Typography level="body2">({quantity["Quantity "]})</Typography>
          {/* <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
          >
            <BookmarkAdd />
          </IconButton> */}
          <AspectRatio minHeight="120px" maxHeight="200px" sx={{ my: 2 }}>
            <img
              src={quantity["image_url"]}
              loading="lazy"
              alt=""
            />
          </AspectRatio>
          <Box sx={{ display: "flex", py: 1, justifyContent: "space-between" }}>
            <Button
              variant="solid"
              color="neutral"
              size="sm"
              disabled={quantity.value < 2}
              onClick={() =>
                dispatch(
                  upsetIngredient({
                    recipeId: "empty_recipe",
                    ingredientTypeId: typeId,
                    ingredientId: id,
                    quantityId: quantity["Quantity id"],
                    quantityValue: quantity.value - 1,
                  })
                )
              }
            >
              -
            </Button>
            <Typography>{quantity.value}</Typography>
            <Button
              variant="solid"
              color="neutral"
              size="sm"
              onClick={() =>
                dispatch(
                  upsetIngredient({
                    recipeId: "empty_recipe",
                    ingredientTypeId: typeId,
                    ingredientId: id,
                    quantityId: quantity["Quantity id"],
                    quantityValue: quantity.value + 1,
                  })
                )
              }
            >
              +
            </Button>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Button
              variant="solid"
              size="md"
              fullWidth
              color="danger"
              aria-label="Explore Bahamas Islands"
              sx={{ ml: "auto", fontWeight: 600, mr: 5 }}
              onClick={() =>
                dispatch(
                  removeIngredient({
                    recipeId: "empty_recipe",
                    ingredientTypeId: typeId,
                    ingredientId: id,
                    quantityId: quantity["Quantity id"],
                  })
                )
              }
            >
              Delete
            </Button>
            <Button
              variant="solid"
              size="md"
              fullWidth
              color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ ml: "auto", fontWeight: 600 }}
              onClick={() => {
                dispatch(
                  updateEditorState({
                    currentView: "ingredient",
                    typeId,
                    ingredientId: id,
                    quantityId: quantity["Quantity id"],
                    quantityValue: quantity.value,
                    // This identify the modified ingredient, such that we cvan delete it if validated
                    modifiedIngredient: {
                      typeId,
                      ingredientId: id,
                      quantityId: quantity["Quantity id"],
                    },
                  })
                );
              }}
            >
              Edit
            </Button>
          </Box>
        </Card>
      ))}
    </React.Fragment>
  );
};

export default IngredientCard;
