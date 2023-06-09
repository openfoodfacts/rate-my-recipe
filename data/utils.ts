import { QuantityType } from "./index";

export function getUnit(quantity: QuantityType, value: number) {
  const isWeightValue = quantity.quantity_default_weight !== undefined;

  if (isWeightValue) {
    return quantity.quantity_unit_id;
  }

  if (value > 1) {
    return quantity.quantity_name_plural;
  }

  return quantity.quantity_name_singular;
}
