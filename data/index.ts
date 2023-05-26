import data from "./ingredient_taxonomy.json";

type CategoryId = string;
type IngredientsId = string;
type QuantityId = string;

export type CategoryType = {
  category_name?: string;
  category_id: CategoryId;
  category_description?: string;
  ingredients: IngredientsId[];
};

export type IngredientsType = {
  default_weight?: any;
  ingredient_taxonomy?: string;
  ingredient_name?: string;
  ingredient_id: IngredientsId;
  ingredient_description?: string;
  ingredient_preparation?: string;
  ingredient_health?: string;
  ingredient_environment?: string;
  quantities: QuantityId[];
  category_id: CategoryId;
};

export type QuantityType = {
  quantity_name?: string;
  quantity_api_name?: string;
  quantity_id: QuantityId;
  quantity_default_weight?: string;
  quantity_default_weight_per_unit?: string;
  quantity_default_number_of_units?: string;
  quantity_image_url?: string;
  category_id: CategoryId;
  ingredient_id: IngredientsId;
};

export type DataType = {
  categories: { [key: CategoryId]: CategoryType };
  ingredients: { [key: IngredientsId]: IngredientsType };
  quantities: { [key: QuantityId]: QuantityType };
};

export default data as DataType;
