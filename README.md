# 🍽️ Rate My Recipe

**Evaluate the nutritional quality of your recipes with Nutri-Score**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-13.2-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

---

## 🌟 Overview

**Rate My Recipe** is an interactive web application that helps users understand the nutritional quality of their recipes. By selecting ingredients and quantities, users receive a **Nutri-Score** (A-E rating) calculated using the [Open Food Facts](https://world.openfoodfacts.org/) database and API.

Built with **Next.js 13**, **Redux Toolkit**, and **Material-UI Joy**, this application provides a seamless experience for recipe nutrition analysis, making healthy eating choices more accessible.

### Key Features

- 🥗 **Interactive Ingredient Selection** - Browse and select from a curated database of ingredients
- 📊 **Real-Time Nutri-Score Calculation** - Get instant nutritional ratings (A-E scale) as you build recipes
- 🎯 **Detailed Nutritional Information** - View complete nutritional breakdown per 100g
- 🔗 **Recipe Sharing** - Share recipes via URL parameters for easy collaboration
- 🌍 **Multi-Language Support** - Built-in internationalization (i18next) with English and French
- 📱 **Responsive Design** - Mobile-first UI with Material-UI Joy components
- ⚡ **No Backend Required** - Fully client-side application using Open Food Facts API

---

## 🎯 Key Features

### Ingredient Management
- **Categorized Ingredients**: Organized by category (meats, vegetables, grains, etc.)
- **Multiple Quantity Options**: Choose from various units (whole items, pieces, grams, etc.)
- **Visual Ingredient Cards**: Product images for easy recognition
- **Edit & Delete**: Modify or remove ingredients from your recipe

### Nutritional Analysis
- **Nutri-Score Grade**: A-E rating based on nutritional quality
- **Nutri-Score 100**: Normalized score (0-100) for comparison
- **Detailed Nutriments**: Complete breakdown including:
  - Energy (kcal, kJ)
  - Macronutrients (carbs, proteins, fats)
  - Sugars, fiber, salt, and more
- **Comparison View**: Compare initial vs. modified recipe values

### Sharing & Collaboration
- **URL-Based Sharing**: Share recipes via clean, parameterized URLs
- **Copy Link**: One-click copy to clipboard
- **Persistent State**: URLs encode complete recipe information

---

## 🏗️ Architecture

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org/) | 13.2.4 | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | 4.9.5 | Type-safe development |
| [React](https://react.dev/) | 18.2.0 | UI library |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 1.9.3 | State management |
| [Material-UI Joy](https://mui.com/joy-ui/) | 5.0.0-alpha.86 | Component library |
| [i18next](https://www.i18next.com/) | 23.1.0 | Internationalization |
| [Open Food Facts API](https://world.openfoodfacts.org/api/v3) | v3 | Nutritional data |

### Project Structure

```
rate-my-recipe/
├── app/                      # Next.js 13 App Router
│   ├── page.tsx             # Main application page
│   ├── layout.tsx           # Root layout with providers
│   └── i18n.js              # i18next configuration
├── components/              # React components
│   ├── AppBar/             # Navigation bar
│   ├── IngredientCards/    # Recipe display
│   ├── IngredientSelector/ # Ingredient selection modal
│   ├── PublishRecipe.tsx   # Share functionality
│   └── ShowNutritionalTable.tsx
├── redux/                   # Redux state management
│   ├── reducers/
│   │   ├── recipes.ts      # Recipe state & API
│   │   └── editor.ts       # Editor state machine
│   ├── selectors.ts        # Memoized selectors
│   └── store.ts            # Store configuration
├── data/                    # Generated ingredient data
│   └── ingredients_config.json
├── i18n/                    # Translations
│   ├── en.json
│   └── fr.json
├── theme/                   # UI theme configuration
├── dataset.tsv             # Source ingredient database
├── parseDataset.js         # Dataset parser
└── [configuration files]
```

---

## 📦 Installation & Setup

### Prerequisites

Before you begin, ensure you have:

- **Node.js**: Version 18.x or higher ([Download](https://nodejs.org/))
  - Recommended: Use [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- **Yarn**: Package manager (install via `npm install --global yarn`)

### Step-by-Step Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/openfoodfacts/rate-my-recipe.git
   cd rate-my-recipe
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Configure Environment (Optional)**

   To use English translations, create a `.env.local` file:

   ```bash
   echo "NEXT_PUBLIC_LANG=en" > .env.local
   ```

   By default, the app uses French.

4. **Start Development Server**

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production** (optional)

   ```bash
   yarn build
   yarn start
   ```

---

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `yarn dev` | Start development server on port 3000 with hot reload |
| **Build** | `yarn build` | Create optimized production build |
| **Production** | `yarn start` | Start production server (requires build first) |
| **Lint** | `yarn lint` | Run ESLint to check code quality |
| **Parse Dataset** | `yarn parse` | Generate `ingredients_config.json` from `dataset.tsv` |

### Script Usage Examples

```bash
# Start development
yarn dev

# Build and run production version
yarn build && yarn start

# Check code quality
yarn lint

# Regenerate ingredient data after modifying dataset.tsv
yarn parse
```

---

## 🔧 Data Management

### Understanding dataset.tsv

The `dataset.tsv` file is the **source of truth** for all ingredients, categories, and quantities in the application.

**File Format**: Tab-Separated Values (TSV)

**Structure**:
```
Category Name → Category ID → Category Description
    Ingredient Name → Ingredient ID → Ingredient Description
        Quantity Name → Quantity ID → Quantity Unit → Weight Data
```

**Key Points**:
- Hierarchical structure: Categories → Ingredients → Quantities
- Each ingredient must have at least one quantity option
- Quantities can be by unit (e.g., "chicken breast") or by weight (e.g., "grams of rice")

### parseDataset.js - Data Parser

The parser converts `dataset.tsv` into `data/ingredients_config.json`, which the application uses.

**Purpose**:
- Parse TSV into structured JSON
- Validate data integrity
- Generate unique quantity IDs
- Apply default values

**Column Mapping**:
```javascript
const COLUMNS = {
  0: "category_name",
  1: "category_id",
  2: "category_description",
  3: "ingredient_name",
  4: "ingredient_id",
  5: "ingredient_description",
  // ... (see parseDataset.js for complete list)
};
```

**Usage**:
```bash
# After modifying dataset.tsv
yarn parse

# Validates:
# ✓ All ingredients have quantities
# ✓ No duplicate IDs
# ✓ Proper data structure
```

**Output**: `data/ingredients_config.json` with three main sections:
- `categories`: Category definitions and ingredient lists
- `ingredients`: Ingredient details and quantity references
- `quantities`: Quantity options with weight/unit data

---

## 🧩 Core Components

### AppBar
Navigation header with recipe sharing functionality
- Share button (copy URL to clipboard)
- Branding and title

### IngredientCards
Display selected recipe ingredients as cards
- Visual ingredient representation
- Edit and delete actions
- Quantity display

### IngredientSelector
Modal interface for adding/editing ingredients
- **Category Selection**: Browse ingredient categories
- **Ingredient Selection**: Choose specific ingredient
- **Quantity Selection**: Pick quantity type (unit/weight)
- **Value Adjustment**: Set quantity amount with +/- buttons

### InteractionWrapper
State machine for ingredient selection flow
- Navigation between selection steps
- Validation logic
- Cancel/confirm actions

### ShowNutritionalTable
Displays calculated nutritional information
- Nutri-Score visualization (A-E)
- Nutri-Score 100 metric
- Detailed nutrient breakdown table

### PublishRecipe
Share recipe via URL
- Generates shareable URL with parameters
- Copy to clipboard functionality
- Success feedback

---

## 🌐 Internationalization

Rate My Recipe supports multiple languages using **i18next**.

### Available Languages

- 🇫🇷 French (default)
- 🇬🇧 English

### Using a Different Language

Set the language in `.env.local`:

```bash
NEXT_PUBLIC_LANG=en  # For English
NEXT_PUBLIC_LANG=fr  # For French (default)
```

### Adding New Translations

1. Create a new JSON file in `i18n/` (e.g., `i18n/es.json`)
2. Copy the structure from `i18n/en.json`
3. Translate all keys
4. Test with `NEXT_PUBLIC_LANG=es` in `.env.local`

**Translation Structure**:
```json
{
  "actions": {
    "add_ingredient": "Add ingredient",
    "delete": "Delete",
    ...
  },
  "nutriments": {
    "energy-kcal_100g": "Energy (kCal)",
    ...
  },
  "messages": {
    "no_ingredients": "You did not select ingredients yet.",
    ...
  }
}
```

For detailed translation guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md#translation-contributions).

---

## 🎨 UI/UX Design

### Component Library: Material-UI Joy

**Why Joy UI?**
- Modern, flexible design system
- Built-in accessibility (ARIA attributes)
- Excellent TypeScript support
- Performance-optimized components
- Easy customization via `sx` prop

### Theme Configuration

Theme defined in `theme/index.tsx`:
- Color palette
- Typography
- Spacing
- Component overrides

### Styling Approach

```typescript
// Using sx prop for component-level styles
<Box sx={{ 
  my: 2,           // margin-y: theme.spacing(2)
  mx: 1,           // margin-x: theme.spacing(1)
  flexGrow: 1 
}}>
  {/* content */}
</Box>
```

### Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Flexible layouts**: Stack and Grid components
- **Adaptive UI**: Components adjust to screen size

---

## 🔗 URL Parameters & Sharing

### How Recipe Sharing Works

Recipes are encoded in URL parameters for easy sharing:

```
https://example.com/?i1=chicken&q1=chicken.breast-unit&v1=4&i2=rice&q2=rice&v2=200
```

### Parameter Format

| Parameter | Description | Example |
|-----------|-------------|---------|
| `i{n}` | Ingredient ID | `i1=chicken` |
| `q{n}` | Quantity ID | `q1=chicken.breast-unit` |
| `v{n}` | Quantity value | `v1=4` |

Where `{n}` is a sequential index (1, 2, 3, ...).

### Example

**Recipe**: 4 chicken breasts + 200g rice

**URL Parameters**:
```
?i1=chicken&q1=chicken.breast-unit&v1=4&i2=rice&q2=rice&v2=200
```

### How It Works

1. User clicks "Share" button
2. App generates URL from current recipe state
3. URL is copied to clipboard
4. Recipient opens URL
5. App parses parameters and reconstructs recipe
6. API calculates nutritional information

For technical details, see [API.md](./API.md#url-parameter-api).

---

## 📊 Redux Architecture

### State Flow Diagram

![Redux Architecture](https://github.com/openfoodfacts/rate-my-recipe/assets/45398769/2a199fa5-5ade-4f4a-bce2-780bd0ed9800)

### Store Structure

```typescript
{
  recipe: {
    recipes: {
      userRecipe: { ingredients, nutriscore, nutriments, ... },
      urlRecipe: { ingredients, nutriscore, nutriments, ... }
    },
    ids: ['userRecipe', 'urlRecipe']
  },
  editor: {
    currentView: 'category' | 'ingredient' | 'quantity' | 'value' | null,
    categoryId, ingredientId, quantityId, quantityValue,
    modifiedIngredient: { ... }
  }
}
```

### State Slices

**Recipe Slice** (`redux/reducers/recipes.ts`):
- Manages recipe ingredients and nutritional data
- Handles API communication with Open Food Facts
- Supports multiple recipe versions (user/URL)

**Editor Slice** (`redux/reducers/editor.ts`):
- Controls ingredient selection state machine
- Tracks selection progress through views
- Manages edit/add operations

### Async Operations

**updateRecipeIngredients** thunk:
1. Updates ingredient list (optimistic)
2. Converts ingredients to API format
3. Calls Open Food Facts API
4. Updates nutritional scores on success

### Selectors

Memoized selectors in `redux/selectors.ts`:
- `selectCurrentIngredients`: Get recipe ingredients
- `selectURLParams`: Generate URL parameters
- `selectEditorState`: Get editor state
- `selectEditorCurrentCategory/Ingredient/Quantity`: Get current selections

For detailed architecture documentation, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or translating the app, your help is appreciated.

### Quick Start

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Test locally (`yarn dev`, `yarn lint`, `yarn build`)
5. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
6. Push and create a Pull Request

### Contribution Areas

- 💻 **Code**: Features, bug fixes, refactoring
- 📚 **Documentation**: Improve guides and examples
- 🌍 **Translations**: Add or improve language support
- 🐛 **Testing**: Report bugs, test features
- 💡 **Ideas**: Suggest features and improvements

### Development Guidelines

- **TypeScript**: Write type-safe code
- **Components**: Use functional components with hooks
- **Redux**: Follow Redux Toolkit patterns
- **Styling**: Use Material-UI Joy's `sx` prop
- **Linting**: Run `yarn lint` before committing

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 📝 Future Enhancements

- [ ] **Recipe Saving**: User accounts and recipe collections
- [ ] **Cooking Instructions**: Add step-by-step cooking directions
- [ ] **Serving Size Adjustment**: Scale recipes for different serving counts
- [ ] **Shopping List**: Generate ingredient shopping lists
- [ ] **Recipe Search**: Search and filter saved recipes
- [ ] **Nutrition Goals**: Set and track nutritional targets
- [ ] **Recipe Recommendations**: Suggest healthier ingredient swaps
- [ ] **Print/Export**: PDF generation for recipes
- [ ] **Social Features**: Recipe comments and ratings
- [ ] **Advanced Filtering**: Filter ingredients by dietary preferences
- [ ] **Meal Planning**: Weekly meal planner with nutrition tracking
- [ ] **Mobile App**: Native iOS/Android apps
- [ ] **Offline Mode**: Service worker for offline access
- [ ] **Image Upload**: Upload photos of prepared recipes

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

See [LICENSE](./LICENSE) for full license text.

**Key Points**:
- ✅ Free to use, modify, and distribute
- ✅ Open source (must share modifications)
- ✅ Commercial use allowed
- ⚠️ Must disclose source code
- ⚠️ Must use same license for derivatives
- ⚠️ Network use = distribution (AGPL clause)

---

## 🔗 Related Resources

### Open Food Facts
- [Open Food Facts Website](https://world.openfoodfacts.org/)
- [API Documentation](https://world.openfoodfacts.org/api/v3)
- [Nutri-Score Information](https://world.openfoodfacts.org/nutriscore)
- [GitHub Organization](https://github.com/openfoodfacts)

### Technologies
- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material-UI Joy Documentation](https://mui.com/joy-ui/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [i18next Documentation](https://www.i18next.com/)

### Project Documentation
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [API.md](./API.md) - API and data structures

---

## 📞 Support

### Get Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/openfoodfacts/rate-my-recipe/issues)
- **GitHub Discussions**: [Ask questions and discuss ideas](https://github.com/openfoodfacts/rate-my-recipe/discussions)
- **Open Food Facts**: [Join the community](https://world.openfoodfacts.org/)

### Reporting Issues

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Browser and device information
- Screenshots (if applicable)

---

## 👥 Maintainers

**Rate My Recipe** is maintained by the [Open Food Facts](https://world.openfoodfacts.org/) community.

**Open Food Facts** is a non-profit organization dedicated to creating a free, open database of food products from around the world.

- 🌍 Website: https://world.openfoodfacts.org/
- 💻 GitHub: https://github.com/openfoodfacts
- 🐦 Twitter: [@OpenFoodFacts](https://twitter.com/OpenFoodFacts)
- 💬 Slack: [Join us](https://slack.openfoodfacts.org/)

---

## 🙏 Acknowledgments

- **Open Food Facts** community for the nutritional database and API
- **Contributors** who have helped improve this project
- **Next.js**, **Redux**, and **Material-UI** teams for excellent tools

---

**Made with ❤️ by the Open Food Facts community**
