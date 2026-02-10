# 🔌 API Documentation

This document provides comprehensive documentation of all API integrations, data structures, and interfaces used in the Rate My Recipe application.

## 📋 Table of Contents

- [API Overview](#api-overview)
- [Open Food Facts Integration](#open-food-facts-integration)
- [Data Structures](#data-structures)
- [Dataset Structure](#dataset-structure)
- [URL Parameter API](#url-parameter-api)
- [Internal Data Flow](#internal-data-flow)

## 🌍 API Overview

Rate My Recipe integrates with the **Open Food Facts API v3** to calculate nutritional information for recipes based on selected ingredients. The application uses a client-side architecture, making all API calls directly from the browser.

### External APIs

| API | Purpose | Authentication | Rate Limit |
|-----|---------|---------------|------------|
| Open Food Facts API v3 | Calculate nutritional data and scores | Basic (public credentials) | Not enforced |

### Internal APIs

This application currently does not expose any custom API endpoints. All data processing happens client-side.

## 🍕 Open Food Facts Integration

### Endpoint Details

**Base URL**: `https://world.openfoodfacts.org/api/v3`

**Product Test Endpoint**: `POST /product/test`

This is a special endpoint that allows calculating nutritional information for virtual products without creating actual database entries.

### Authentication

```typescript
const headers = new Headers({
  Authorization: `Basic off:off`,
  'Content-type': 'application/json; charset=UTF-8'
});
```

**Note**: Uses public test credentials (`off:off`). This is intended for development and testing purposes.

### Request Format

#### Request Structure

```typescript
{
  method: 'PATCH',
  headers: {
    Authorization: 'Basic off:off',
    'Content-type': 'application/json; charset=UTF-8'
  },
  body: JSON.stringify({
    lc: string,              // Language code (e.g., 'fr', 'en')
    tags_lc: string,         // Tags language code
    fields: string,          // Comma-separated fields to return
    product: {
      lang: string,          // Product language
      categories_tags: string[],  // Category identifiers
      ingredients_text_fr: string // Ingredient list (localized)
    }
  })
}
```

#### Example Request

```typescript
const response = await fetch(
  'https://world.openfoodfacts.org/api/v3/product/test',
  {
    method: 'PATCH',
    headers: {
      Authorization: 'Basic off:off',
      'Content-type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify({
      lc: 'fr',
      tags_lc: 'fr',
      fields: 'ingredients,nutriments_estimated,nutriscore_grade,nutriscore_score,ecoscore_grade,ecoscore_score',
      product: {
        lang: 'fr',
        categories_tags: ['en:soups'],
        ingredients_text_fr: 'Poulet 200 g, riz 100 g, tomate 150 g'
      }
    })
  }
);
```

### Request Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lc` | string | Yes | Language code for interface |
| `tags_lc` | string | Yes | Language for tags |
| `fields` | string | Yes | Comma-separated list of fields to return |
| `product.lang` | string | Yes | Product data language |
| `product.categories_tags` | string[] | Yes | Product categories (affects Nutri-Score calculation) |
| `product.ingredients_text_fr` | string | Yes | Comma-separated ingredient list with quantities |

#### Requested Fields

```
ingredients,
nutriments_estimated,
nutriscore_grade,
nutriscore_score,
ecoscore_grade,
ecoscore_score
```

### Response Format

#### Response Structure

```typescript
{
  code: string,                    // Status code
  status: number,                  // HTTP status
  status_verbose: string,          // Status message
  product: {
    nutriscore_grade: 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown',
    nutriscore_score: number,      // Range: -15 to 42 (lower is better)
    ecoscore_grade: string,        // Eco-Score grade or 'unknown'
    ecoscore_score: number,        // Eco-Score numeric value
    nutriments_estimated: Nutriments,
    ingredients: Ingredient[]      // Parsed ingredient list
  }
}
```

#### Example Response

```json
{
  "code": "test",
  "status": 1,
  "status_verbose": "product updated",
  "product": {
    "nutriscore_grade": "b",
    "nutriscore_score": 5,
    "ecoscore_grade": "unknown",
    "ecoscore_score": null,
    "nutriments_estimated": {
      "energy-kcal_100g": 156,
      "energy-kj_100g": 653,
      "carbohydrates_100g": 18.5,
      "sugars_100g": 2.1,
      "fat_100g": 4.2,
      "saturated-fat_100g": 1.1,
      "fiber_100g": 1.8,
      "proteins_100g": 12.3,
      "salt_100g": 0.5,
      "sodium_100g": 0.2,
      "calcium_100g": 15,
      "iron_100g": 1.2
    },
    "ingredients": [
      {
        "id": "en:chicken",
        "text": "Poulet",
        "percent_estimate": 40,
        "vegan": "no",
        "vegetarian": "no"
      },
      // ... more ingredients
    ]
  }
}
```

### Response Fields

#### Nutri-Score

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `nutriscore_grade` | string | 'a'-'e', 'unknown' | Letter grade (A is best) |
| `nutriscore_score` | number | -15 to 42 | Raw score (lower is better) |

**Nutri-Score Conversion**:
```typescript
// Convert to 0-100 scale (100 = best)
nutriscore_100 = Math.round(100 - ((nutriscore_score + 15) / 57) * 100);
```

#### Eco-Score

| Field | Type | Description |
|-------|------|-------------|
| `ecoscore_grade` | string | Letter grade or 'unknown' |
| `ecoscore_score` | number | Numeric score |

**Note**: Eco-Score is often 'unknown' for recipes because we use a generic category ('en:soups') that doesn't provide enough specificity for environmental impact calculation.

#### Nutriments

All nutriment values are per 100g of the prepared recipe.

| Field | Unit | Description |
|-------|------|-------------|
| `energy-kcal_100g` | kcal | Energy in kilocalories |
| `energy-kj_100g` | kJ | Energy in kilojoules |
| `carbohydrates_100g` | g | Total carbohydrates |
| `sugars_100g` | g | Sugars |
| `fat_100g` | g | Total fat |
| `saturated-fat_100g` | g | Saturated fat |
| `fiber_100g` | g | Dietary fiber |
| `proteins_100g` | g | Proteins |
| `salt_100g` | g | Salt |
| `sodium_100g` | g | Sodium |

### Error Handling

```typescript
// Check for missing nutriscore
if (!response.product.nutriscore_grade) {
  console.error('Missing nutriscore in response:', response);
}

// Handle "unknown" grades
if (nutriscore_grade === 'unknown') {
  nutriscore_grade = ''; // Display as empty
}
```

### API Limitations

1. **Rate Limiting**: Not enforced, but be respectful
2. **Test Endpoint**: Results are not persisted in the database
3. **Language Support**: Limited to supported Open Food Facts languages
4. **Category Dependency**: Nutri-Score calculation requires a category
5. **Generic Category**: Using 'en:soups' provides functional but not specific calculations

## 📦 Data Structures

### TypeScript Interfaces

#### Ingredient

```typescript
interface Ingredient {
  categoryId: string;           // Category this ingredient belongs to
  id: string;                   // Unique ingredient identifier
  quantities: Quantity[];       // Available quantity options
}
```

**Example**:
```typescript
{
  categoryId: "meat-fish-eggs",
  id: "chicken",
  quantities: [
    { id: "chicken.whole-unit", value: 1 },
    { id: "chicken.thigh-unit", value: 6 },
    { id: "chicken.breast-unit", value: 4 }
  ]
}
```

#### Quantity

```typescript
interface Quantity {
  id: string;                   // Unique quantity identifier (ingredient.unit format)
  value: number;                // Amount of this quantity
}
```

**Example**:
```typescript
{
  id: "chicken.breast-unit",
  value: 4
}
```

#### Recipe

```typescript
interface Recipe {
  servings: number;             // Number of servings
  ingredients: Ingredient[];    // List of ingredients with quantities
  instructions: string[];       // Cooking instructions (future feature)
  ecoscore: string;             // Eco-Score grade
  ecoscore_100: number;         // Eco-Score normalized to 0-100
  nutriscore: string;           // Nutri-Score grade
  nutriscore_100: number;       // Nutri-Score normalized to 0-100
  nutriments: Nutriments;       // Nutritional information
}
```

#### Nutriments

```typescript
interface Nutriments {
  'energy-kcal_100g'?: number;
  'energy-kj_100g'?: number;
  'carbohydrates_100g'?: number;
  'sugars_100g'?: number;
  'fat_100g'?: number;
  'saturated-fat_100g'?: number;
  'fiber_100g'?: number;
  'proteins_100g'?: number;
  'salt_100g'?: number;
  'sodium_100g'?: number;
  // Additional nutrients may be present
  [key: string]: number | undefined;
}
```

#### Editor State

```typescript
interface EditorState {
  currentView: 'category' | 'ingredient' | 'quantity' | 'value' | null;
  categoryId: string | null;
  ingredientId: string | null;
  quantityId: string | null;
  quantityValue: number | null;
  modifiedIngredient?: {
    categoryId: string | null;
    ingredientId: string | null;
    quantityId: string | null;
  };
}
```

**State Machine**:
- `null`: Editor closed
- `'category'`: Selecting ingredient category
- `'ingredient'`: Selecting specific ingredient
- `'quantity'`: Selecting quantity type (e.g., whole, pieces, grams)
- `'value'`: Adjusting quantity value

### Ingredient Data Configuration

The ingredient database is loaded from `data/ingredients_config.json`:

```typescript
interface IngredientsConfig {
  categories: {
    [categoryId: string]: CategoryData;
  };
  ingredients: {
    [ingredientId: string]: IngredientData;
  };
  quantities: {
    [quantityId: string]: QuantityData;
  };
}
```

#### CategoryData

```typescript
interface CategoryData {
  category_name: string;        // Display name
  category_id: string;          // Unique identifier
  category_description: string; // Description text
  ingredients: string[];        // Array of ingredient IDs
}
```

#### IngredientData

```typescript
interface IngredientData {
  category_id: string;
  ingredient_id: string;
  ingredient_name: string;
  ingredient_description?: string;
  ingredient_preparation?: string;
  ingredient_health?: string;
  ingredient_environment?: string;
  quantities: string[];         // Array of quantity IDs
}
```

#### QuantityData

```typescript
interface QuantityData {
  quantity_id: string;                      // Generated: ingredient_id.unit_id
  category_id: string;
  ingredient_id: string;
  quantity_name_plural: string;             // Display name (plural)
  quantity_name_singular: string;           // Display name (singular)
  quantity_ingredient_name?: string;        // Alternative ingredient name
  quantity_unit_id?: string;                // Unit identifier
  quantity_unit: string;                    // Unit (g, kg, ml, etc.)
  quantity_default_weight?: number;         // Default weight in grams
  quantity_default_weight_per_unit?: number;// Weight per unit
  quantity_default_number_of_units?: number;// Default count
  quantity_step: number;                    // Increment/decrement step
  quantity_image_url?: string;              // Product image URL
}
```

## 🗂️ Dataset Structure

### TSV Format

The `dataset.tsv` file is a tab-separated values file that defines all available ingredients, categories, and quantities.

#### File Structure

```
Line 1-5: Header comments and metadata
Line 6: Column headers
Line 7+: Data rows
```

#### Column Definitions

Based on the `COLUMNS` object in `parseDataset.js`:

| Index | Column Name | Description |
|-------|-------------|-------------|
| 0 | `category_name` | Display name of ingredient category |
| 1 | `category_id` | Unique identifier for category |
| 2 | `category_description` | Description of the category |
| 3 | `ingredient_name` | Display name of ingredient |
| 4 | `ingredient_id` | Unique identifier for ingredient |
| 5 | `ingredient_description` | Description of the ingredient |
| 6 | `ingredient_preparation` | Preparation notes |
| 7 | `ingredient_health` | Health information |
| 8 | `ingredient_environment` | Environmental impact info |
| 9 | `quantity_name_plural` | Quantity display name (plural) |
| 10 | `quantity_name_singular` | Quantity display name (singular) |
| 11 | `quantity_ingredient_name` | Alternative ingredient name for this quantity |
| 12 | `quantity_unit_id` | Unit identifier (e.g., 'whole-unit', 'thigh-unit') |
| 13 | `quantity_unit` | Unit symbol (g, kg, ml, etc.) |
| 14 | `quantity_default_weight` | Default weight in grams |
| 15 | `quantity_default_weight_per_unit` | Weight per individual unit |
| 16 | `quantity_default_number_of_units` | Default number of units |
| 17 | `quantity_step` | Step value for increment/decrement |
| 18 | `quantity_image_url` | URL to product image |

#### Data Hierarchy

```
Category (Columns 0-2)
  └── Ingredient (Columns 3-8)
        └── Quantity (Columns 9-18)
```

### Adding New Ingredients

To add a new ingredient to the dataset:

1. **Open `dataset.tsv`** in a spreadsheet editor or text editor

2. **Add Category Row** (if new category):
   ```
   [Category Name]	[category-id]	[Description]	[empty columns 3-18]
   ```

3. **Add Ingredient Row**:
   ```
   [empty 0-2]	[Ingredient Name]	[ingredient-id]	[Description]	[Prep]	[Health]	[Environment]	[empty 9-18]
   ```

4. **Add Quantity Row(s)** (one per quantity option):
   ```
   [empty 0-8]	[Plural Name]	[Singular Name]	[Ingredient Name]	[unit-id]	[unit]	[weight]	[weight_per_unit]	[default_units]	[step]	[image_url]
   ```

5. **Run Parser**:
   ```bash
   yarn parse
   ```

6. **Verify Output**:
   - Check `data/ingredients_config.json`
   - Test in the app at `http://localhost:3000`

#### Example

```tsv
Vegetables	vegetables	Fresh and frozen vegetables
			Tomato	tomato	Red or ripe tomatoes		Good source of lycopene	Low environmental impact
									tomates	tomate	Tomate		g	500			100	https://...
									boîtes	boîte	Tomates en boîte	canned-unit	g	400	400	1	1	https://...
```

### Data Validation

The parser validates:
- All ingredients must have at least one quantity
- Category IDs must be unique
- Ingredient IDs must be unique within categories
- Quantity IDs are auto-generated: `{ingredient_id}.{unit_id}` or just `{ingredient_id}`

## 🔗 URL Parameter API

### Parameter Format

Rate My Recipe uses URL parameters to share recipes. The format follows a pattern:

```
?i{n}={ingredient_id}&q{n}={quantity_id}&v{n}={value}
```

Where `{n}` is a sequential number starting from 1.

### Parameter Keys

| Prefix | Description | Example |
|--------|-------------|---------|
| `i{n}` | Ingredient ID | `i1=chicken` |
| `q{n}` | Quantity ID | `q1=chicken.breast-unit` |
| `v{n}` | Quantity Value | `v1=4` |

### Example URLs

**Single Ingredient**:
```
https://example.com/?i1=chicken&q1=chicken.breast-unit&v1=4
```

**Multiple Ingredients**:
```
https://example.com/?i1=chicken&q1=chicken.breast-unit&v1=4&i2=rice&q2=rice&v2=200&i3=tomato&q3=tomato&v3=150
```

### Encoding/Decoding Logic

#### Encoding (Recipe to URL)

```typescript
export const selectURLParams = createSelector(
  selectCurrentIngredients,
  (ingredients) => {
    let i = 0;
    return ingredients
      .flatMap((ingredient) =>
        ingredient.quantities.flatMap((quantity) => {
          i += 1;
          return [
            `${INGREDIENT}${i}=${ingredient.id}`,
            `${QUANTITY}${i}=${quantity.id}`,
            `${VALUE}${i}=${quantity.value}`,
          ];
        })
      )
      .join("&");
  }
);
```

#### Decoding (URL to Recipe)

```typescript
// Step 1: Group parameters by index
function groupURLParams(params: { key: string; value: string }[]) {
  const rep: {
    [k: string]: {
      ingredientId?: string;
      quantityId?: string;
      value?: number;
    };
  } = {};

  params.forEach(({ key, value }) => {
    if (key.startsWith('i')) {
      const id = key.slice(1);
      rep[id] = { ...rep[id], ingredientId: value };
    }
    if (key.startsWith('q')) {
      const id = key.slice(1);
      rep[id] = { ...rep[id], quantityId: value };
    }
    if (key.startsWith('v')) {
      const id = key.slice(1);
      rep[id] = { ...rep[id], value: parseInt(value) };
    }
  });

  return rep;
}

// Step 2: Group by ingredient
function groupByIngredient(groupedParams) {
  const rep: { [ingredientId: string]: { q: string; v: number }[] } = {};
  
  Object.values(groupedParams).forEach(
    ({ ingredientId, quantityId, value }) => {
      if (!value || isNaN(value) || !ingredientId) return;
      
      rep[ingredientId] = [
        ...(rep[ingredientId] ?? []),
        {
          q: quantityId ?? data.ingredients[ingredientId].quantities[0],
          v: value,
        },
      ];
    }
  );

  return rep;
}
```

### Validation Rules

1. **Required Fields**: All three parameters (i, q, v) must be present for each group
2. **Valid Ingredient**: Ingredient ID must exist in `ingredients_config.json`
3. **Valid Quantity**: Quantity ID must be in the ingredient's quantities array
4. **Numeric Value**: Value must be a valid number
5. **Fallback**: If quantity is missing but ingredient is valid, use first quantity

### Security Considerations

- **No Injection Risk**: All values are validated against known ingredient/quantity IDs
- **Type Safety**: Values are parsed and type-checked
- **Graceful Failure**: Invalid parameters are silently ignored
- **No Sensitive Data**: URLs contain only ingredient IDs and quantities

## 🔄 Internal Data Flow

### From User Action to API Call

```typescript
// 1. User validates ingredient selection
onValidateClick() {
  dispatch(updateRecipeIngredients({
    recipeId: 'userRecipe',
    type: 'upsert',
    ingredientCategoryId: 'meat-fish-eggs',
    ingredientId: 'chicken',
    quantityId: 'chicken.breast-unit',
    quantityValue: 4
  }));
}

// 2. Thunk processes the update
async (action, thunkAPI) => {
  // Update ingredients array
  const nextIngredients = ingredientReducer(
    state.recipes[recipeId].ingredients,
    action
  );
  
  // Convert to API format
  const ingredients = nextIngredients
    .flatMap((ingredient) => {
      return ingredient.quantities.map((quantity) => {
        const quantityData = data.quantities[quantity.id];
        const weight = quantity.value * quantityData.quantity_default_weight_per_unit;
        return `${quantityData.quantity_ingredient_name} ${weight} ${quantityData.quantity_unit}`;
      });
    })
    .join(", ");
  // Result: "Blancs de poulet 800 g"
  
  // 3. Call API
  const response = await fetch('https://world.openfoodfacts.org/api/v3/product/test', {
    // ... API call
  });
  
  return response.json();
}

// 4. Update state with response
builder.addCase(updateRecipeIngredients.fulfilled, (state, action) => {
  state.recipes[recipeId].nutriscore = action.payload.product.nutriscore_grade;
  // ... update other fields
});
```

### Weight Calculation

```typescript
// Determine if quantity is "per unit" or direct weight
const isPerUnit = quantityData.quantity_default_weight_per_unit !== undefined;

// Calculate weight
const weight = quantity.value * (
  isPerUnit 
    ? quantityData.quantity_default_weight_per_unit  // e.g., 200g per breast
    : 1  // Direct weight (e.g., 500g)
);
```

**Examples**:
- Chicken breasts: `4 (units) × 200 (g/unit) = 800g`
- Rice: `100 (g) × 1 = 100g`

## 📚 Related Documents

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design patterns
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [README.md](./README.md) - Project overview and setup

## 🔗 External Resources

- [Open Food Facts API Documentation](https://world.openfoodfacts.org/api/v3)
- [Nutri-Score Information](https://world.openfoodfacts.org/nutriscore)
- [Eco-Score Information](https://world.openfoodfacts.org/eco-score-the-environmental-impact-of-food-products)

---

*Last Updated: 2026-02-04*
