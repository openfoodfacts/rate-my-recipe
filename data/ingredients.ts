import type { IngredientType } from "../redux/reducers/ingredients";

export const availableIngredients: IngredientType[] = [
  // VPO
  {
    id: "chicken",
    type: "VPO",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
    decorator: "🐔",
  },
  {
    id: "beaf",
    type: "VPO",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
    decorator: "🐮",
  },

  {
    id: "mouton",
    type: "VPO",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
    decorator: "🐑",
  },
  {
    id: "porc",
    type: "VPO",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
    decorator: "🐷",
  },
  {
    id: "fish",
    type: "VPO",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
    decorator: "🐟",
  },

  {
    id: "egg",
    type: "VPO",
    quantityUnit: "unit",
    quantityOptions: [1, 2, 3, 4, 5, 6],
    decorator: "🥚",
  },

  // Feculent_Legumineuse_cereale

  {
    id: "lentilles",
    type: "Feculent_Legumineuse_cereale",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
  {
    id: "semoule",
    type: "Feculent_Legumineuse_cereale",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
  {
    id: "riz",
    type: "Feculent_Legumineuse_cereale",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
  {
    id: "haricots rouges",
    type: "Feculent_Legumineuse_cereale",
    quantityUnit: "g",
    quantityOptions: [100, 250, 500],
  },
  // legumes
  {
    id: "brocoli",
    type: "legumes",
    quantityUnit: "piece",
    quantityOptions: [0.5, 1, 2],
    decorator: "🥦",
  },
  {
    id: "poivron",
    type: "legumes",
    quantityUnit: "piece",
    quantityOptions: [0.5, 1, 2],
    decorator: "🫑",
  },
  {
    id: "aubergine",
    type: "legumes",
    quantityUnit: "piece",
    quantityOptions: [0.5, 1, 2],
    decorator: "🍆",
  },
  // matiere_grasse

  {
    id: "huile de tournesole",
    type: "matiere_grasse",
    quantityUnit: "cuillere",
    quantityOptions: [1, 2, 3],
  },

  {
    id: "huile d'olive",
    type: "matiere_grasse",
    quantityUnit: "cuillere",
    quantityOptions: [1, 2, 3],
  },

  {
    id: "huile de palme",
    type: "matiere_grasse",
    quantityUnit: "cuillere",
    quantityOptions: [1, 2, 3],
  },

  {
    id: "beurre",
    type: "matiere_grasse",
    quantityUnit: "g",
    quantityOptions: [5, 15, 25, 50],
  },
  // bouillon
  {
    id: "kub",
    type: "bouillon",
    quantityUnit: "piece",
    quantityOptions: [1, 2, 3],
  },
  // condiment
  {
    id: "pate d'arachide",
    type: "condiment",
    quantityUnit: "g",
    quantityOptions: [5, 10, 25],
  },
  {
    id: "sel",
    type: "condiment",
    quantityUnit: "g",
    quantityOptions: [1, 2, 5],
  },
];
