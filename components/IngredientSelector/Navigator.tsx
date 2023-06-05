"use client";
import * as React from "react";
import data from "../../data";
import { Button, Input, Stack, Grid, Typography } from "@mui/joy";
import {
  selectEditorCurrentIngredient,
  selectEditorCurrentQuantity,
  selectEditorCurrentCategory,
  selectEditorState,
} from "@/redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  updateEditorState,
  updateCategory,
  updateIngredient,
  updateQuantity,
  updateValue,
  decreaseQuantityValue,
  increaseQuantityValue,
  ViewsTypes,
  closeEditor,
} from "@/redux/reducers/editor";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";

export default function Navigator() {
  const state = useSelector(selectEditorState);
  const dispatch = useDispatch();
  const { currentView: view, quantityValue } = state;
  const currentCategory = useSelector(selectEditorCurrentCategory);
  const currentIngredient = useSelector(selectEditorCurrentIngredient);
  const currentQuantity = useSelector(selectEditorCurrentQuantity);

  const skipQuantityView =
    currentIngredient && currentIngredient.quantities.length === 1;
  if (view === "category") {
    return (
      <InteractionWrapper>
        {Object.values(data.categories).map((category) => (
          <Button
            color="primary"
            key={category.category_id}
            onClick={() => {
              dispatch(
                updateCategory({
                  currentView: "ingredient",
                  categoryId: category.category_id,
                })
              );
            }}
          >
            {category.category_name}
          </Button>
        ))}
      </InteractionWrapper>
    );
  }
  if (view === "ingredient") {
    return (
      <InteractionWrapper skipQuantityView={skipQuantityView}>
        {currentCategory?.ingredients.map((ingredientId) => {
          const ingredient = data.ingredients[ingredientId];
          const image_url =
            data.quantities[ingredient.quantities[0]].quantity_image_url;

          return (
            <Button
              variant="outlined"
              key={ingredientId}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
              onClick={() => {
                if (ingredient.quantities.length === 1) {
                  // If only one quantity type, we set it directly
                  dispatch(
                    updateQuantity({
                      currentView: "value",
                      ingredientId,
                      quantityId: ingredient.quantities[0],
                    })
                  );

                  return;
                }
                dispatch(
                  updateIngredient({
                    currentView: "quantity",
                    ingredientId,
                  })
                );
              }}
            >
              {ingredient.ingredient_name}
              {image_url && (
                <img
                  src={image_url}
                  height={100}
                  width={100}
                  style={{ objectFit: "contain", marginLeft: "10px" }}
                />
              )}
            </Button>
          );
        })}
      </InteractionWrapper>
    );
  }
  if (view === "quantity") {
    return (
      <InteractionWrapper>
        {currentIngredient?.quantities.map((quantityId) => {
          const quantity = data.quantities[quantityId];
          return (
            <Button
              variant="outlined"
              key={quantityId}
              onClick={() => {
                dispatch(
                  updateQuantity({
                    currentView: "value",
                    quantityId: quantityId,
                  })
                );
              }}
            >
              {quantity.quantity_ingredient_name}
              {quantity.quantity_image_url && (
                <img
                  src={quantity.quantity_image_url}
                  height={150}
                  width={150}
                  style={{ objectFit: "contain" }}
                />
              )}
            </Button>
          );
        })}
      </InteractionWrapper>
    );
  }

  if (currentQuantity === null) {
    return null;
  }
  const isWeightValue = currentQuantity?.quantity_default_weight !== undefined;
  const updateStep = 1;
  return (
    <InteractionWrapper skipQuantityView={skipQuantityView}>
      <img
        src={currentQuantity.quantity_image_url}
        height={150}
        width={150}
        style={{ objectFit: "contain" }}
      />
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={!quantityValue || quantityValue - updateStep <= 0}
          onClick={() => {
            dispatch(decreaseQuantityValue({ step: updateStep }));
          }}
        >
          -
        </Button>
        <Input
          type="number"
          value={quantityValue ?? undefined}
          onChange={(event) =>
            dispatch(updateValue({ quantityValue: Number(event.target.value) }))
          }
          endDecorator={isWeightValue ? <Typography>g</Typography> : (quantityValue! > 1 ? currentQuantity?.quantity_name_plural : currentQuantity?.quantity_name_singular)}
        />
        <Button
          onClick={() => {
            dispatch(increaseQuantityValue({ step: updateStep }));
          }}
        >
          +
        </Button>
      </Stack>
    </InteractionWrapper>
  );
}
const viewsOrder: ViewsTypes[] = ["category", "ingredient", "quantity", "value"];

const viewToValue = {
  category: "categoryId",
  ingredient: "ingredientId",
  quantity: "quantityId",
  value: "quantityValue",
} as const;

const InteractionWrapper = ({ skipQuantityView, children }: any) => {
  const {
    currentView: view,
    modifiedIngredient,
    ...values
  } = useSelector(selectEditorState);

  const dispatch = useDispatch();

  const viewIndex = viewsOrder.findIndex((v) => v === view);
  const prevView =
    skipQuantityView && viewsOrder[viewIndex - 1] === "quantity"
      ? viewsOrder[viewIndex - 2]
      : viewsOrder[viewIndex - 1];
  const nextView =
    skipQuantityView && viewsOrder[viewIndex + 1] === "quantity"
      ? viewsOrder[viewIndex + 2]
      : viewsOrder[viewIndex + 1];

  const disableNext =
    !viewToValue[view!] || values[viewToValue[view!]] === null;

  const disableValidation = viewsOrder.some(
    // Test if some value are not specified
    (v) => values[viewToValue[view!]] === null
  );
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ position: "relative", height: "100%" }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={!prevView}
          onClick={() => dispatch(updateEditorState({ currentView: prevView }))}
        >
          Prev
        </Button>
        <Button
          disabled={!nextView || disableNext}
          onClick={() => dispatch(updateEditorState({ currentView: nextView }))}
        >
          Next
        </Button>
      </Stack>

      {children}

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ position: "absolute", bottom: 0, width: "100%" }}
      >
        <Button
          fullWidth
          color="danger"
          onClick={() => dispatch(closeEditor({}))}
        >
          Cancel
        </Button>
        <Button
          fullWidth
          color="success"
          disabled={disableValidation}
          onClick={() => {
            if (
              modifiedIngredient !== undefined &&
              values.quantityId !== modifiedIngredient.quantityId
            ) {
              dispatch<any>(
                updateRecipeIngredients({
                  recipeId: "userRecipe",
                  type: "delete",
                  ingredientId: modifiedIngredient.ingredientId!,
                  quantityId: modifiedIngredient.quantityId!,
                })
              );
            }
            dispatch<any>(
              updateRecipeIngredients({
                recipeId: "userRecipe",
                type: "upsert",
                ingredientCategoryId: values.categoryId!,
                ingredientId: values.ingredientId!,
                quantityId: values.quantityId!,
                quantityValue: values.quantityValue!,
              })
            );
            dispatch(closeEditor({}));
          }}
        >
          Validate
        </Button>
      </Stack>
    </Stack>
  );
};
