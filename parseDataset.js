/**
 * The ingredients categories, ingredients and quantities are configured in Google Sheets table
 * that is exported to the dataset.tsv file
 * Running "nodejs parseDataset.js" generates a structured ingredients_config.json file
 */

const fs = require("fs");

const parseNumber = (n) => {
  if (n === undefined || Number.isNaN(n)) {
    return undefined;
  }
  return parseInt(n);
};

const TITLE_LINE = 3;

const parseLine = (line) =>
  line.split("\t").map((cell) => cell.replace("\r", ""));

const content = fs.readFileSync("dataset.tsv", "utf8");

const lines = content.split("\n");

/**
 * Uncomment those lines to get the COLUMNS object from the line "TITLE_LINE"
 */
console.log("const COLUMNS = {");
parseLine(lines[TITLE_LINE]).forEach((columnTitle, columnIndex) => {
  console.log(`${columnIndex}: "${columnTitle}",`);
});
console.log("}");

// Generated by the script before
const COLUMNS = {
  0: "category_name",
  1: "category_id",
  2: "category_description",
  3: "ingredient_name",
  4: "ingredient_id",
  5: "ingredient_description",
  6: "ingredient_preparation",
  7: "ingredient_health",
  8: "ingredient_environment",
  9: "quantity_name_plural",
  10: "quantity_name_singular",
  11: "quantity_ingredient_name",
  12: "quantity_unit_id",
  13: "quantity_unit",
  14: "quantity_default_weight",
  15: "quantity_default_weight_per_unit",
  16: "quantity_default_number_of_units",
  17: "quantity_step",
  18: "quantity_image_url",
};

// Level of depths (end excluded)
const categoriesRange = [0, 3];
const ingredientsRange = [3, 9];
const quantitiesRange = [9, 18];

const createObject = (line) => {
  const rep = {};
  line.forEach((value, colIndex) => {
    if (value !== "") {
      rep[COLUMNS[colIndex]] = value;
    }
  });
  return rep;
};

const data = {
  categories: {},
  ingredients: {},
  quantities: {},
};

let currentState = {};
lines.slice(TITLE_LINE + 1).forEach((line) => {
  const parsedLine = parseLine(line);

  if (parsedLine.filter((element) => element !== "").length === 0) {
    return;
  }
  const lineObject = createObject(parsedLine);

  const isNewCategory = parsedLine
    .slice(...categoriesRange)
    .some((cell) => cell !== "");
  const isNewIngredient = parsedLine
    .slice(...ingredientsRange)
    .some((cell) => cell !== "");
  const isNewQuantity = parsedLine
    .slice(...quantitiesRange)
    .some((cell) => cell !== "");

  if (isNewCategory) {
    currentState = { category_id: lineObject.category_id };
    data.categories[lineObject.category_id] = {
      ...lineObject,
      ingredients: [],
    };
    return;
  }
  if (isNewIngredient) {
    currentState = {
      category_id: currentState.category_id,
      ingredient_id: lineObject.ingredient_id,
      ingredient_name: lineObject.ingredient_name,
    };
    data.categories[currentState.category_id].ingredients.push(
      lineObject.ingredient_id
    );
    data.ingredients[lineObject.ingredient_id] = {
      ...lineObject,
      ...currentState,
      quantities: [],
    };
    return;
  }
  if (isNewQuantity) {

    // Concatenate ingredient_id and quantity_unit_id to get the unique quantity_id
    // e.g. beef.ground-meat or beef.meat
    // If we don't have a quantity_unit_id, just use the ingredient_id
    const quantity_id =
      currentState.ingredient_id + (lineObject.quantity_unit_id ? "." + lineObject.quantity_unit_id : '');
    lineObject.quantity_id = quantity_id;

    data.ingredients[currentState.ingredient_id].quantities.push(quantity_id);

    // Defaultize values
    // if we don't have a unit in the table, assume it is "g"
    lineObject.quantity_unit = lineObject.quantity_unit || "g";    

    // If quantity_ingredient_name is not specified, use ingredient_name
    lineObject.quantity_ingredient_name =
      lineObject.quantity_ingredient_name || currentState.ingredient_name;

    // Parse numbers when provided
    lineObject.quantity_default_weight = parseNumber(
      lineObject.quantity_default_weight
    );
    lineObject.quantity_default_weight_per_unit = parseNumber(
      lineObject.quantity_default_weight_per_unit
    );
    lineObject.quantity_default_number_of_units = parseNumber(
      lineObject.quantity_default_number_of_units
    );
    lineObject.quantity_step = parseNumber(lineObject.quantity_step) ?? 1;


    data.quantities[quantity_id] = {
      ...lineObject,
      ...currentState,
    };
    return;
  }
});

// Check that we don't have ingredients without quantities
Object.values(data.categories).forEach((category) => {
  console.log("category: " + category.category_id);
  category.ingredients.forEach((ingredient_id) => {
    console.log("- ingredient: " + ingredient_id);
    ingredient = data.ingredients[ingredient_id];
    if (ingredient.quantities.length == 0) {
      throw new Error("no quantities defined for ingredient " + ingredient.ingredient_id);
    }
  });
});

fs.writeFile(
  "./data/ingredients_config.json",
  JSON.stringify(data, null, 2),
  (err) => {
    if (err) {
      console.error(err);
    }
    console.log("file updated");
  }
);
