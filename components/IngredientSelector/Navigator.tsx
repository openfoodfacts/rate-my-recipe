"use client";
import * as React from "react";
import { useTranslation } from "react-i18next";
import data from "../../data";
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
  updateEditorState,
} from "@/redux/reducers/editor";
import { getUnit } from "@/data/utils";
import { InteractionWrapper } from "@/components/IngredientSelector/InteractionWrapper";
import { IngredientCardSingleView } from "@/components/IngredientSelector/IngredientCardSingleView";
import { UnknownIngredientView } from "@/components/IngredientSelector/UnknownIngredientView";
import { CategoryCard } from "@/components/IngredientSelector/CategoryCard";
import { GenericCard } from "@/components/shared/molecules/GenericCard";

export default function Navigator() {
  const { t } = useTranslation();
  const state = useSelector(selectEditorState);
  const dispatch = useDispatch();
  const { currentView: view, quantityValue, ingredientName } = state;
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
            categoryId={category.category_id}
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
            <GenericCard
              imgUrl={image_url}
              onClick={onClick}
              title={`${ingredient.ingredient_name} (${ingredient.quantities[0]})`}
              key={ingredientId}
            />
          );
        })}
        <GenericCard
          imgUrl={null}
          onClick={() =>
            dispatch(
              updateQuantity({
                currentView: "customIngredient",
                ingredientId: undefined,
                quantityId: "unknown",
              })
            )
          }
          title={t("actions.other_ingredient")}
        />
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
            <GenericCard
              title={quantity.quantity_ingredient_name}
              onClick={onCLick}
              imgUrl={quantity.quantity_image_url || undefined}
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

  if (view === "customIngredient") {
    return (
      <InteractionWrapper skipQuantityView={skipQuantityView}>
        <UnknownIngredientView
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
          onInputChange={(event) => {
            dispatch(
              updateValue({
                quantityValue: Number(event.target.value),
              })
            );
          }}
          title={ingredientName}
          onTitleChange={(newValue) =>
            dispatch(updateEditorState({ ingredientName: newValue }))
          }
          step={currentQuantity.quantity_step}
        />
      </InteractionWrapper>
    );
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
        weightPerUnit={currentQuantity.quantity_default_weight_per_unit}
      />
    </InteractionWrapper>
  );
}
