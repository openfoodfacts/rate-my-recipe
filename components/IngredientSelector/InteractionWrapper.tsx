import { useDispatch, useSelector } from "react-redux";
import { selectEditorState } from "@/redux/selectors";
import { updateRecipeIngredients } from "@/redux/reducers/recipes";
import {
  closeEditor,
  updateEditorState,
  ViewsTypes,
} from "@/redux/reducers/editor";
import { Button, Stack } from "@mui/joy";
import * as React from "react";
import { CategoriesAndCardsContainer } from "@/components/IngredientSelector/CategoriesAndCardsContainer";

interface InteractionWrapperProps {
  skipQuantityView: boolean | null;
  children: React.ReactNode;
}

const viewsOrder: ViewsTypes[] = [
  "category",
  "ingredient",
  "quantity",
  "value",
];

const viewToValue = {
  category: "categoryId",
  ingredient: "ingredientId",
  quantity: "quantityId",
  value: "quantityValue",
} as const;

export const InteractionWrapper = ({
  skipQuantityView,
  children,
}: InteractionWrapperProps) => {
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
    (_) => values[viewToValue[view!]] === null
  );
  const onValidateClick = () => {
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
  };
  const onCancelClick = () => dispatch(closeEditor({}));

  return (
    <>
      <Stack direction="column" spacing={2} height={"90%"}>
        <Stack direction="row" justifyContent="space-between">
          <Button
            disabled={!prevView}
            onClick={() =>
              dispatch(updateEditorState({ currentView: prevView }))
            }
          >
            Prev
          </Button>
          <Button
            disabled={!nextView || disableNext}
            onClick={() =>
              dispatch(updateEditorState({ currentView: nextView }))
            }
          >
            Next
          </Button>
        </Stack>
        <CategoriesAndCardsContainer>{children}</CategoriesAndCardsContainer>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button fullWidth color="danger" onClick={onCancelClick}>
          Cancel
        </Button>
        <Button
          fullWidth
          color="success"
          disabled={disableValidation}
          onClick={onValidateClick}
        >
          Validate
        </Button>
      </Stack>
    </>
  );
};
