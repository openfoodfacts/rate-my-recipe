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

/**
 * Props for the InteractionWrapper component.
 * 
 * @interface InteractionWrapperProps
 * @property {boolean | null} skipQuantityView - Whether to skip the quantity selection view
 * @property {React.ReactNode} children - Content to display in the cards container
 */
interface InteractionWrapperProps {
  skipQuantityView: boolean | null;
  children: React.ReactNode;
}

/**
 * Ordered sequence of views in the ingredient selection state machine.
 * User progresses through these views: category → ingredient → quantity → value
 * 
 * @constant {ViewsTypes[]}
 */
const viewsOrder: ViewsTypes[] = [
  "category",
  "ingredient",
  "quantity",
  "value",
];

/**
 * Maps view types to their corresponding state property names.
 * Used to check if a value has been selected for the current view.
 * 
 * @constant {Object.<ViewsTypes, string>}
 */
const viewToValue = {
  category: "categoryId",
  ingredient: "ingredientId",
  quantity: "quantityId",
  value: "quantityValue",
} as const;

/**
 * InteractionWrapper - State machine wrapper for ingredient selection flow.
 * 
 * This component manages the multi-step ingredient selection process:
 * 1. Category selection
 * 2. Ingredient selection  
 * 3. Quantity type selection (can be skipped if only one option)
 * 4. Quantity value adjustment
 * 
 * Features:
 * - Navigation between steps (Prev/Next buttons)
 * - Validation (Next disabled until selection made)
 * - Skip logic (optional quantity view when only one quantity option)
 * - Validate action (saves ingredient to recipe)
 * - Cancel action (closes without saving)
 * - Edit mode (tracks original ingredient for replacement)
 * 
 * State Flow:
 * - Reads editor state from Redux
 * - Calculates prev/next views based on current position and skip logic
 * - Dispatches actions to navigate or finalize selection
 * 
 * @component
 * @param {InteractionWrapperProps} props - Component props
 * @returns {JSX.Element} Wrapper with navigation controls and content area
 * 
 * @example
 * <InteractionWrapper skipQuantityView={ingredient.quantities.length === 1}>
 *   <CategoryCards />  // or <IngredientCards /> or <QuantityPicker /> etc.
 * </InteractionWrapper>
 */
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

  // Calculate current position in the view order
  const viewIndex = viewsOrder.findIndex((v) => v === view);
  
  /**
   * Calculate previous view with skip logic.
   * If skipQuantityView is true and prev would be 'quantity', skip to the view before that.
   */
  const prevView =
    skipQuantityView && viewsOrder[viewIndex - 1] === "quantity"
      ? viewsOrder[viewIndex - 2]
      : viewsOrder[viewIndex - 1];
  
  /**
   * Calculate next view with skip logic.
   * If skipQuantityView is true and next would be 'quantity', skip to the view after that.
   */
  const nextView =
    skipQuantityView && viewsOrder[viewIndex + 1] === "quantity"
      ? viewsOrder[viewIndex + 2]
      : viewsOrder[viewIndex + 1];

  /**
   * Disable Next button if no value selected for current view.
   */
  const disableNext =
    !viewToValue[view!] || values[viewToValue[view!]] === null;

  /**
   * Disable Validate button if any required value is missing.
   */
  const disableValidation = viewsOrder.some(
    // Test if some value are not specified
    (_) => values[viewToValue[view!]] === null
  );
  
  /**
   * Handles validation (confirm) action.
   * 
   * Logic:
   * 1. If editing an existing ingredient with different quantity, delete the old one
   * 2. Upsert the new/modified ingredient with current values
   * 3. Close the editor
   * 
   * Dispatches updateRecipeIngredients twice if needed (delete + upsert).
   */
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
  
  /**
   * Handles cancel action - closes editor without saving changes.
   */
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
