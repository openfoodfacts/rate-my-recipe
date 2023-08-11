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
import { CardsContainer } from "@/components/IngredientSelector/CardsContainer";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Stack
      justifyContent="space-between"
      height={"100%"}
      direction="column"
      spacing={2}
    >
      <Stack direction="row" justifyContent="space-between">
        <Button
          disabled={!prevView}
          onClick={() => dispatch(updateEditorState({ currentView: prevView }))}
        >
           {t("actions.prev")}
        </Button>
        <Button
          disabled={!nextView || disableNext}
          onClick={() => dispatch(updateEditorState({ currentView: nextView }))}
        >
           {t("actions.next")}
        </Button>
      </Stack>

      <CardsContainer>{children}</CardsContainer>

      <Stack direction="row" justifyContent="space-between">
        <Button fullWidth color="danger" onClick={onCancelClick}>
        {t("actions.cancel")}
        </Button>
        <Button
          fullWidth
          color="success"
          disabled={disableValidation}
          onClick={onValidateClick}
        >
           {t("actions.validate")}
        </Button>
      </Stack>
    </Stack>
  );
};
