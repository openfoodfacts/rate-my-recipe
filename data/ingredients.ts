import type { IngredientType } from "../redux/reducers/ingredients";

export const availableIngredients: IngredientType[] = [
  {
    id: "chicken",
    type: "meat",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
  {
    id: "beaf",
    type: "meat",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },

  {
    id: "porc",
    type: "meat",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
];
