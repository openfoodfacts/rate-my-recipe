"use client";
import * as React from "react";
import data from "../../data/ingredient_taxonomy.json";
import { Button, Input, Stack } from "@mui/joy";
import {
  selectEditorCurrentIngredient,
  selectEditorCurrentQuantity,
  selectEditorCurrentType,
  selectEditorState,
  selectEditorView,
} from "@/redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
  DataType,
  updateEditorState,
  updateType,
  updateIngredient,
  updateQuantity,
  updateValue,
  decreaseQuantityValue,
  increaseQuantityValue,
  ViewsTypes,
  closeEditor,
} from "@/redux/reducers/editor";
import {
  removeIngredient,
  updateRecipeIngredients,
  upsetIngredient,
} from "@/redux/reducers/recipes";

export default function Navigator() {
  const state = useSelector(selectEditorState);
  const dispatch = useDispatch();
  const {
    currentView: view,
    typeId,
    ingredientId,
    quantityId,
    quantityValue,
  } = state;
  const currentType = useSelector(selectEditorCurrentType);
  const currentIngredient = useSelector(selectEditorCurrentIngredient);
  const currentQuantity = useSelector(selectEditorCurrentQuantity);

  const skipQuantityView =
    currentIngredient && currentIngredient.quantities.length === 1;

  if (view === "type") {
    return (
      <InteractionWrapper>
        {(data as DataType).map((type) => (
          <Button
            key={type["Ingredient type id"]}
            onClick={() => {
              dispatch(
                updateType({
                  currentView: "ingredient",
                  typeId: type["Ingredient type id"],
                })
              );
            }}
          >
            {type["Ingredient type"]}
          </Button>
        ))}
      </InteractionWrapper>
    );
  }
  if (view === "ingredient") {
    return (
      <InteractionWrapper skipQuantityView={skipQuantityView}>
        {currentType?.ingredients.map((ingredient) => (
          <Button
            key={ingredient["Ingredient id"]}
            onClick={() => {
              if (ingredient.quantities.length === 1) {
                // If only one quantity type, we set it directly
                dispatch(
                  updateQuantity({
                    currentView: "value",
                    ingredientId: ingredient["Ingredient id"],
                    quantityId: ingredient.quantities[0]["Quantity id"],
                  })
                );

                return;
              }
              dispatch(
                updateIngredient({
                  currentView: "quantity",
                  ingredientId: ingredient["Ingredient id"],
                })
              );
            }}
          >
            {ingredient["Ingredient"]}
            {ingredient.quantities[0].image_url && (
              <img
                src={ingredient.quantities[0].image_url}
                height={150}
                width={150}
                style={{ objectFit: "contain" }}
              />
            )}
          </Button>
        ))}
      </InteractionWrapper>
    );
  }
  if (view === "quantity") {
    return (
      <InteractionWrapper>
        {currentIngredient?.quantities.map((quantity) => (
          <Button
            key={quantity["Quantity id"]}
            onClick={() => {
              dispatch(
                updateQuantity({
                  currentView: "value",
                  quantityId: quantity["Quantity id"],
                })
              );
            }}
          >
            {quantity["Quantity "]}
            {quantity.image_url && (
              <img
                src={quantity.image_url}
                height={150}
                width={150}
                style={{ objectFit: "contain" }}
              />
            )}
          </Button>
        ))}
      </InteractionWrapper>
    );
  }
  return (
    <InteractionWrapper skipQuantityView={skipQuantityView}>
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={quantityValue === 1}
          onClick={() => {
            dispatch(decreaseQuantityValue({}));
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
        />
        <Button
          onClick={() => {
            dispatch(increaseQuantityValue({}));
          }}
        >
          +
        </Button>
      </Stack>
    </InteractionWrapper>
  );
}

const viewsOrder: ViewsTypes[] = ["type", "ingredient", "quantity", "value"];

const viewToValue = {
  type: "typeId",
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
              // dispatch(
              //   removeIngredient({
              //     recipeId: "empty_recipe",

              dispatch<any>(
                updateRecipeIngredients({
                  type: "delete",
                  ingredientId: modifiedIngredient.ingredientId!,
                  quantityId: modifiedIngredient.quantityId!,
                })
              );
            }
            // dispatch(
            //   upsetIngredient({
            //     recipeId: "empty_recipe",
            dispatch<any>(
              updateRecipeIngredients({
                type: "upsert",
                ingredientTypeId: values.typeId!,
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
