import data from "./ingredients_config.json";

type CategoryId = string;
type IngredientId = string;
type QuantityId = string;

export type CategoryType = {
  category_name?: string;
  category_id: CategoryId;
  category_description?: string;
  ingredients: IngredientId[];
};

export type IngredientType = {
  quantity_default_number_of_units?: any;
  quantity_default_weight?: any;
  default_weight?: any;
  ingredient_taxonomy?: string;
  ingredient_name?: string;
  ingredient_id: IngredientId;
  ingredient_description?: string;
  ingredient_preparation?: string;
  ingredient_health?: string;
  ingredient_environment?: string;
  quantities: QuantityId[];
  category_id: CategoryId;
};

export type QuantityType = {
  quantity_name_plural?: string;
  quantity_name_singular?: string;
  quantity_ingredient_name?: string;
  quantity_id: QuantityId;
  quantity_unit_id?: string;
  quantity_default_weight?: string;
  quantity_default_weight_per_unit?: string;
  quantity_default_number_of_units?: string;
  quantity_image_url?: string;
  category_id: CategoryId;
  ingredient_id: IngredientId;
};

export type DataType = {
  categories: { [key: CategoryId]: CategoryType };
  ingredients: { [key: IngredientId]: IngredientType };
  quantities: { [key: QuantityId]: QuantityType };
};

export default data as DataType;
