"use client";
import * as React from "react";
import data from "../../data";
import { Button } from "@mui/joy";
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
import { IngredientAndQuantityCard } from "@/components/IngredientSelector/IngredientAndQuantityCard";
import { IngredientCardSingleView } from "@/components/IngredientSelector/IngredientCardSingleView";
import { CategoryCard } from "@/components/IngredientSelector/CategoryCard";

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
          <CategoryCard
            title={category.category_name}
            key={category.category_id}
            onClick={() => {
              dispatch(
                updateCategory({
                  currentView: "ingredient",
                  categoryId: category.category_id,
                })
              );
            }}
          />
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
            data.quantities[ingredient.quantities[0]].quantity_image_url ??
            null;

          const onClick = () => {
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
          };

          return (
            <IngredientAndQuantityCard
              name={ingredient.ingredient_name}
              imageUrl={image_url}
              onClick={onClick}
              key={ingredientId}
            />
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
          const onCLick = () => {
            dispatch(
              updateQuantity({
                currentView: "value",
                quantityId: quantityId,
              })
            );
          };
          return (
            <IngredientAndQuantityCard
              name={quantity.quantity_ingredient_name}
              onClick={onCLick}
              imageUrl={quantity.quantity_image_url || undefined}
              key={quantityId}
            />
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
      <IngredientCardSingleView
        onIncrement={() => {
          dispatch(
            increaseQuantityValue({ step: currentQuantity.quantity_step })
          );
        }}
        onDecrement={() => {
          dispatch(
            decreaseQuantityValue({ step: currentQuantity.quantity_step })
          );
        }}
        quantityValue={quantityValue!}
        imgSrc={currentQuantity.quantity_image_url}
        onInputChange={(event) => {
          dispatch(
            updateValue({
              quantityValue: Number(event.target.value),
            })
          );
        }}
        unit={getUnit(currentQuantity, quantityValue!)}
        title={currentQuantity.quantity_ingredient_name}
        step={currentQuantity.quantity_step}
      />
    </InteractionWrapper>
  );
}
