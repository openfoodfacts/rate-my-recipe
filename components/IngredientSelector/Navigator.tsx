"use client";
import * as React from "react";
import data from "../../data";
import { Button, Input, Stack, Typography } from "@mui/joy";
import {
  selectEditorCurrentIngredient,
  selectEditorCurrentQuantity,
  selectEditorCurrentCategory,
  selectEditorState,
} from "@/redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCategory,
  updateIngredient,
  updateQuantity,
  updateValue,
  decreaseQuantityValue,
  increaseQuantityValue,
} from "@/redux/reducers/editor";
import { getUnit } from "@/data/utils";
import { InteractionWrapper } from "@/components/IngredientSelector/InteractionWrapper";

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
      <InteractionWrapper skipQuantityView={skipQuantityView}>
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
          console.log({ q: ingredient.quantities[0] });
          const image_url =
            data.quantities[ingredient.quantities[0]].quantity_image_url ??
            null;

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
      <InteractionWrapper skipQuantityView={skipQuantityView}>
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
          disabled={
            !quantityValue || quantityValue - currentQuantity.quantity_step <= 0
          }
          onClick={() => {
            dispatch(
              decreaseQuantityValue({ step: currentQuantity.quantity_step })
            );
          }}
        >
          -
        </Button>
        <Input
          type="number"
          value={quantityValue!}
          onChange={(event) => {
            dispatch(
              updateValue({
                quantityValue: Number(event.target.value),
              })
            );
          }}
          endDecorator={
            <Typography>{getUnit(currentQuantity, quantityValue!)}</Typography>
          }
        />
        <Button
          onClick={() => {
            dispatch(
              increaseQuantityValue({ step: currentQuantity.quantity_step })
            );
          }}
        >
          +
        </Button>
      </Stack>
    </InteractionWrapper>
  );
}
