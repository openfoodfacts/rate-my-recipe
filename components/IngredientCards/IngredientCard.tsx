import { QuantityType } from "@/data";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { ValueEditor } from "@/components/shared/molecules/ValueEditor";
import { getUnit } from "@/data/utils";
import * as React from "react";
import { IngredientPicture } from "@/components/IngredientCards/IngredientPicture";

export const IngredientCard = (
  props: QuantityType & {
    value: number;
    onIncrement(): void;
    onDecrement(): void;
    onEdit?(): void;
    onDelete?(): void;
  }
) => {
  // If the weight is not per g, we will display an equivalence
  var weight = "";
  if (props.quantity_default_weight_per_unit !== undefined) {
    weight =
      " (" + props.value! * props.quantity_default_weight_per_unit + " g)";
  }

  return (
    <Card variant="outlined" sx={{ maxWidth: 300, m: "auto" }}>
      <IngredientPicture
        ingredientName={props.quantity_ingredient_name}
        imageUrl={props.quantity_image_url}
      />
      <ValueEditor
        onIncrement={props.onIncrement}
        onDecrement={props.onDecrement}
        disabledDecrement={props.value < 2}
        onDelete={props.onDelete}
        onEdit={props.onEdit}
      >
        <Typography>{`${props.value} ${getUnit(
          props,
          props.value
        )}${weight}`}</Typography>
      </ValueEditor>
    </Card>
  );
};
