"use client";
import * as React from "react";
import data from "../../data";
import { Button, Input, Stack } from "@mui/joy";
import {
  selectEditorCurrentIngredient,
  selectEditorCurrentQuantity,
  selectEditorCurrentType,
  selectEditorState,
} from "@/redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import {
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
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import { ButtonBase } from "@mui/material";

export default function Navigator() {
  const state = useSelector(selectEditorState);
  const dispatch = useDispatch();
  const { currentView: view, quantityValue } = state;
  const { weight } = state;
  const currentType = useSelector(selectEditorCurrentType);
  const currentIngredient = useSelector(selectEditorCurrentIngredient);

  const skipQuantityView =
    currentIngredient && currentIngredient.quantities.length === 1;
    console.log(weight, "    console.log(Weight)")
  if (view === "type") {
    return (
      
      <InteractionWrapper>
        {Object.values(data.categories).map((category) => (
          <Button
            key={category.category_id}
            onClick={() => {
              dispatch(
                updateType({
                  currentView: "ingredient",
                  typeId: category.category_id,
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
        {currentType?.ingredients.map((ingredientId) => {
          const ingredient = data.ingredients[ingredientId];
          const image_url =
            data.quantities[ingredient.quantities[0]].quantity_image_url;

          return (
            <Button
              key={ingredientId}
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
  if (view === "quantity") {
    return (
   
      <InteractionWrapper>
        {currentIngredient?.quantities.map((quantityId) => {
          const quantity = data.quantities[quantityId];
          return (
            <Button
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
              {quantity.quantity_name}
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

     let value = "";
      if (currentIngredient) {
        const ingredient = data.ingredients[currentIngredient.ingredient_id];
  console.log(ingredient)
  const defaultWeight = data.quantities[currentIngredient.ingredient_id]?.quantity_default_weight;
 console.log(defaultWeight)
        if (ingredient.category_id === data.ingredients['olive-oild'].category_id) {
          if (ingredient.ingredient_name === data.ingredients['olive-oild'].ingredient_name) {
            value += data.quantities['olive-oil'].quantity_name;;
          } else if (ingredient.ingredient_name === data.ingredients['rapeseed-oil'].ingredient_name) {
            value += data.quantities['rapeseed-oil'].quantity_name;
          }
        } else if (ingredient.category_id === data.categories['ingredient-principal'].category_id) 
        {
          if (
            ingredient.ingredient_name === data.ingredients.chicken.ingredient_name||
            ingredient.ingredient_name === data.ingredients.beef.ingredient_name ||
            ingredient.ingredient_name === data.ingredients.lamb.ingredient_name 
          ) {
            if (ingredient.ingredient_id === data.ingredients.chicken.ingredient_id) {
              value += ` ${ingredient.ingredient_name} `;
            } else {
              value += ` ${ingredient.ingredient_name} `;
            }
          
          }
        } else if (ingredient.category_id === data.categories.vegetables.category_id) {
          if (
            ingredient.ingredient_name === data.quantities.onion.quantity_name ||
            ingredient.ingredient_name === data.quantities.carrot.quantity_name||
            ingredient.ingredient_name === data.quantities.courgette.quantity_name||
            ingredient.ingredient_name === data.quantities.potatoes.quantity_name
          ) {
            value = ` ${ingredient.ingredient_name}`;
          }
        }
      console.log(quantityValue)
  
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
        value={
        ingredient.ingredient_id === data.ingredients.chicken.ingredient_id || ingredient.category_id === data.ingredients['olive-oild'].category_id  || ingredient.category_id === data.categories.vegetables.category_id
          ? quantityValue?.toString()
          : `${weight?.toString()} gr` /* here weight is undefiend ? */
      }
        onChange={(event) =>
        dispatch(updateValue({ quantityValue: Number(event.target.value) }))
        
       }
      />
     
     {(ingredient.category_id === "ingredient-principal" || ingredient.category_id === "fat" || ingredient.category_id === "vegetables") && (
      <span>{value}</span>
    )}
    
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
   return null;
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

