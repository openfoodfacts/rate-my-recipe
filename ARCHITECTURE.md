# 🏗️ Architecture Documentation

This document provides an in-depth overview of the Rate My Recipe application architecture, design decisions, and technical implementation details.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Decisions](#technology-decisions)
- [Project Structure](#project-structure)
- [State Management Architecture](#state-management-architecture)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [API Integration](#api-integration)
- [Build & Deployment](#build--deployment)

## 🎯 Architecture Overview

Rate My Recipe is a **client-side web application** built with Next.js 13 that allows users to create recipes by selecting ingredients and quantities, then calculates nutritional information using the Open Food Facts API v3.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│                     (React + TypeScript)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐      ┌──────────────┐      ┌────────────┐  │
│  │            │      │              │      │            │  │
│  │    UI      │◄────►│    Redux     │◄────►│  API       │  │
│  │ Components │      │    Store     │      │  Service   │  │
│  │            │      │              │      │            │  │
│  └────────────┘      └──────────────┘      └────────────┘  │
│       │                     │                     │         │
│       │                     │                     │         │
│       ▼                     ▼                     ▼         │
│  Material-UI           Selectors          Open Food Facts  │
│  Joy UI                                         API v3      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │  Static Assets    │
                    │  (dataset.tsv)    │
                    └───────────────────┘
```

## 💡 Technology Decisions

### Why Next.js 13 App Router?

**Next.js 13** with the App Router was chosen for several key reasons:

1. **Server Components**: Enables better performance through selective hydration
2. **File-Based Routing**: Simplifies navigation and code organization
3. **Built-in Optimization**: Automatic code splitting, image optimization, and font loading
4. **Static Export Capability**: Can be deployed as a static site (compatible with Netlify)
5. **Developer Experience**: Hot module replacement, TypeScript support, and fast refresh

**App Router Specific Benefits**:
- Layouts for shared UI components
- Improved data fetching patterns
- Better support for streaming and suspense
- Cleaner separation of client and server code

### Why Redux Toolkit?

**Redux Toolkit** was selected over alternatives (Context API, Zustand, etc.) because:

1. **Predictable State Management**: Centralized state with strict patterns
2. **DevTools Integration**: Excellent debugging capabilities with time-travel debugging
3. **Async Handling**: Built-in `createAsyncThunk` for API calls
4. **Immutability Helpers**: Immer integration for simpler state updates
5. **TypeScript Support**: First-class TypeScript integration
6. **Middleware Support**: Redux Logger for development debugging

**Use Case Fit**:
- Complex state interactions between recipes and UI editor
- Need for URL parameter synchronization
- Multiple async operations (API calls)
- Time-travel debugging for recipe modifications

### Why Material-UI Joy?

**Material-UI Joy** provides:

1. **Modern Design System**: Clean, accessible component library
2. **Customization**: Flexible theming and styling options via `sx` prop
3. **Accessibility**: Built-in ARIA attributes and keyboard navigation
4. **TypeScript Support**: Full type safety for props
5. **Performance**: Optimized components with minimal bundle size
6. **Mobile-First**: Responsive components out of the box

**Joy UI Advantages**:
- More flexible than standard Material-UI
- Better performance characteristics
- Simpler API surface
- Focus on modern React patterns

## 📁 Project Structure

### Directory Organization

```
rate-my-recipe/
├── app/                          # Next.js 13 App Router
│   ├── page.tsx                  # Main page component
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles
│   └── i18n.js                   # i18next initialization
│
├── components/                   # React components
│   ├── AppBar/                   # Navigation and sharing controls
│   ├── IngredientCards/          # Recipe ingredient display
│   ├── IngredientSelector/       # Ingredient selection interface
│   │   ├── InteractionWrapper.tsx # State machine for selection flow
│   │   ├── CardsContainer.tsx    # Layout wrapper
│   │   └── ...
│   ├── PublishRecipe.tsx         # Share button component
│   ├── ShowNutritionalTable.tsx  # Nutrition display
│   ├── Nutriscore.tsx           # Nutri-Score visualization
│   └── shared/                   # Shared utilities
│
├── redux/                        # Redux state management
│   ├── store.ts                  # Store configuration
│   ├── StateProvider.tsx         # Redux provider wrapper
│   ├── selectors.ts              # Memoized selectors
│   └── reducers/
│       ├── recipes.ts            # Recipe state and API logic
│       └── editor.ts             # Editor state machine
│
├── data/                         # Generated data files
│   ├── ingredients_config.json   # Generated from dataset.tsv
│   ├── index.ts                  # Data exports
│   └── utils.ts                  # Data utilities
│
├── i18n/                         # Internationalization
│   ├── en.json                   # English translations
│   ├── fr.json                   # French translations
│   └── messages.js               # Translation utilities
│
├── theme/                        # UI theming
│   └── index.tsx                 # Joy UI theme configuration
│
├── public/                       # Static assets
│   └── ...
│
├── dataset.tsv                   # Ingredient database (TSV format)
├── parseDataset.js              # Dataset parser script
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
└── netlify.toml                 # Netlify deployment config
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `IngredientCard.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `selectors.ts`)
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Styles**: `kebab-case.css` or `globals.css`
- **Constants**: Component-scoped or in dedicated files

### Folder Organization Rationale

**Component Co-location**:
- Related components grouped in folders (e.g., `IngredientSelector/`)
- Improves maintainability and discoverability
- Enables feature-based organization

**Redux Separation**:
- Clear separation between state management and UI
- Reducers and selectors grouped by feature
- Promotes single responsibility principle

**Data Layer**:
- Generated data kept separate from source data
- Parser script at root for easy access
- Clear data transformation pipeline

## 🔄 State Management Architecture

### Redux Store Structure

```typescript
RootState {
  recipe: {
    recipes: {
      userRecipe: {
        ingredients: Ingredient[],
        servings: number,
        instructions: string[],
        nutriscore: string,
        nutriscore_100: number,
        ecoscore: string,
        ecoscore_100: number,
        nutriments: Nutriments
      },
      urlRecipe: {
        // Same structure as userRecipe
        // Used for displaying URL-shared recipes
      }
    },
    ids: string[]
  },
  editor: {
    currentView: ViewsTypes | null,
    categoryId: string | null,
    ingredientId: string | null,
    quantityId: string | null,
    quantityValue: number | null,
    modifiedIngredient: {
      categoryId: string | null,
      ingredientId: string | null,
      quantityId: string | null
    }
  }
}
```

### State Slices

#### Recipe Slice (`recipes.ts`)

**Purpose**: Manages recipe data and nutritional calculations

**State Shape**:
```typescript
{
  recipes: {
    [recipeId: string]: RecipeState
  },
  ids: string[]
}
```

**Key Responsibilities**:
- Store ingredient lists for multiple recipes
- Manage nutritional data (Nutri-Score, Eco-Score, nutriments)
- Handle API communication with Open Food Facts
- Parse URL parameters into recipe state

**Async Thunks**:
- `updateRecipeIngredients`: Main thunk that:
  1. Updates ingredient list
  2. Converts ingredients to API format
  3. Calls Open Food Facts API
  4. Updates nutritional scores

#### Editor Slice (`editor.ts`)

**Purpose**: Manages the ingredient selection state machine

**State Shape**:
```typescript
{
  currentView: 'category' | 'ingredient' | 'quantity' | 'value' | null,
  categoryId: string | null,
  ingredientId: string | null,
  quantityId: string | null,
  quantityValue: number | null,
  modifiedIngredient: {...}
}
```

**Key Responsibilities**:
- Track current selection step
- Store selected values at each step
- Manage the selection flow state machine
- Handle ingredient modification tracking

**State Machine Flow**:
```
null → category → ingredient → quantity → value → null (closed)
  ▲                                                   │
  └───────────────────────────────────────────────────┘
```

### Selector Patterns

Selectors use **Reselect** for memoization to prevent unnecessary re-renders:

```typescript
export const selectCurrentIngredients = createSelector(
  (state: RootState, recipeId: string) => recipeId,
  (state: RootState) => state.recipe.recipes,
  (recipeId, recipes) => recipes[recipeId].ingredients
);
```

**Benefits**:
- Memoized computation prevents recalculation
- Derived state (URL parameters, formatted data)
- Decouples components from state shape

### Reducer Patterns

**Immutable Updates** via Immer (built into Redux Toolkit):
```typescript
builder.addCase(updateRecipeIngredients.fulfilled, (state, action) => {
  const { recipeId } = action.meta.arg;
  // Direct mutation syntax (Immer converts to immutable updates)
  state.recipes[recipeId].nutriscore = action.payload.nutriscore_grade;
});
```

**Nested State Updates**:
```typescript
// Example from ingredientReducer
return [
  ...ingredients.slice(0, ingredientIndex),
  {
    ...ingredients[ingredientIndex],
    quantities: [/* updated quantities */]
  },
  ...ingredients.slice(ingredientIndex + 1)
];
```

## 🧩 Component Architecture

### Component Hierarchy

```
App (page.tsx)
├── AppBar
│   ├── Share Link Button
│   └── Save Recipe Button
│
├── IngredientCards
│   └── IngredientCard (multiple)
│       ├── IngredientPicture
│       └── EditButtons
│
├── Sheet (Bottom Controls)
│   ├── Add Ingredient Button
│   ├── PublishRecipe
│   └── ShowNutritionalTable
│       └── Nutriscore
│
└── IngredientSelector (Modal)
    └── InteractionWrapper
        ├── Navigation Buttons (Prev/Next)
        ├── CardsContainer
        │   ├── CategoryCards (view: category)
        │   ├── IngredientCards (view: ingredient)
        │   ├── QuantityCards (view: quantity)
        │   └── QuantityPicker (view: value)
        └── Action Buttons (Cancel/Validate)
```

### Props Patterns

**Component Props Structure**:
```typescript
// Props with clear, single-purpose interfaces
interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: () => void;
  onDelete: () => void;
}

// Composition over configuration
interface InteractionWrapperProps {
  skipQuantityView: boolean | null;
  children: React.ReactNode;
}
```

### Composition Strategies

**Container/Presentation Pattern**:
- **Container**: Connected to Redux (`page.tsx`)
- **Presentation**: Pure components receiving props (`IngredientCard.tsx`)

**Compound Components**:
```typescript
<InteractionWrapper skipQuantityView={false}>
  <CardsContainer>
    {/* Flexible content based on view state */}
  </CardsContainer>
</InteractionWrapper>
```

**Hooks for Logic Reuse**:
```typescript
const { t } = useTranslation();
const dispatch = useDispatch();
const ingredients = useSelector(selectCurrentIngredients);
```

## 🔄 Data Flow

### User Interaction Flow

```
User Action (Click/Input)
    ↓
Event Handler
    ↓
Dispatch Action/Thunk
    ↓
Reducer Updates State (optimistic)
    ↓
Component Re-render
    ↓
[If Async] API Call
    ↓
Thunk Fulfilled/Rejected
    ↓
Reducer Updates State (with API data)
    ↓
Component Re-render (final state)
```

### Example: Adding an Ingredient

```
1. User clicks "Add Ingredient" button
   ↓
2. Dispatch openEditor() action
   ↓
3. Editor state: currentView = 'category'
   ↓
4. IngredientSelector modal opens
   ↓
5. User selects category → updateCategory() action
   ↓
6. Editor state updated, view = 'ingredient'
   ↓
7. User selects ingredient → updateIngredient()
   ↓
8. User selects quantity → updateQuantity()
   ↓
9. User adjusts value → increaseQuantityValue() / decreaseQuantityValue()
   ↓
10. User clicks "Validate"
    ↓
11. Dispatch updateRecipeIngredients() async thunk
    ↓
12. Reducer adds ingredient (pending state)
    ↓
13. API call to Open Food Facts
    ↓
14. API response received (fulfilled state)
    ↓
15. Reducer updates nutritional data
    ↓
16. UI shows updated Nutri-Score and ingredient card
    ↓
17. Dispatch closeEditor()
    ↓
18. Modal closes, editor state reset
```

### URL Parameter Handling Flow

```
1. User shares recipe URL with parameters
   ↓
2. Next.js parses URL search params
   ↓
3. useSearchParams() hook provides params
   ↓
4. useEffect in page.tsx triggers on mount
   ↓
5. Dispatch updateRecipeIngredients with type: 'overideFromURLParams'
   ↓
6. groupURLParams() parses parameters (i1, q1, v1 pattern)
   ↓
7. groupByIngredient() structures data
   ↓
8. Reducer overwrites recipe.ingredients
   ↓
9. Auto-trigger API call for nutritional data
   ↓
10. UI displays shared recipe
```

### State Update Flow Diagram

See README.md for the Redux architecture diagram showing the complete flow.

## 🌐 API Integration

### Open Food Facts API v3

**Endpoint**: `https://world.openfoodfacts.org/api/v3/product/test`

**Purpose**: Calculate nutritional values and scores for recipe ingredients

**Authentication**:
```typescript
const headers = new Headers({
  Authorization: `Basic off:off`,
  'Content-type': 'application/json; charset=UTF-8'
});
```

### Request Format

```typescript
{
  method: 'PATCH',
  body: JSON.stringify({
    lc: 'fr',                    // Language code
    tags_lc: 'fr',               // Tags language
    fields: 'ingredients,nutriments_estimated,nutriscore_grade,...',
    product: {
      lang: 'fr',
      categories_tags: ['en:soups'],  // Generic category for calculation
      ingredients_text_fr: 'chicken 200 g, rice 100 g, ...'
    }
  })
}
```

### Response Format

```typescript
{
  product: {
    nutriscore_grade: 'a' | 'b' | 'c' | 'd' | 'e',
    nutriscore_score: number,      // Range: -15 to 42
    ecoscore_grade: string,
    ecoscore_score: number,
    nutriments_estimated: {
      'energy-kcal_100g': number,
      'carbohydrates_100g': number,
      'sugars_100g': number,
      'fat_100g': number,
      'saturated-fat_100g': number,
      'fiber_100g': number,
      'proteins_100g': number,
      'salt_100g': number,
      // ... more nutrients
    }
  }
}
```

### Error Handling

```typescript
// API errors logged but don't block UI
if (!action.payload.product.nutriscore_grade) {
  console.error(action.payload);
}

// Handle "unknown" scores
if (state.recipes[recipeId].nutriscore == "unknown") {
  state.recipes[recipeId].nutriscore = "";
}
```

## 🚀 Build & Deployment

### Build Process

**Development**:
```bash
yarn dev
# Starts Next.js dev server on port 3000
# Features: Hot Module Replacement, Fast Refresh
```

**Production Build**:
```bash
yarn build
# Creates optimized production build in .next/
# Includes: Code splitting, minification, tree-shaking
```

**Production Server**:
```bash
yarn start
# Starts Next.js production server
```

### Deployment Configuration

**Netlify** (configured via `netlify.toml`):
```toml
[build]
  command = "yarn build"
  publish = ".next"
```

**Deployment Steps**:
1. Code pushed to main branch
2. Netlify detects changes
3. Runs `yarn build`
4. Deploys `.next` directory
5. Site available at custom domain

### Environment Variables

**Local Development** (`.env.local`):
```bash
NEXT_PUBLIC_LANG=en  # Set UI language
```

**Build-Time Variables**:
- All `NEXT_PUBLIC_*` variables are embedded in client bundle
- Available via `process.env.NEXT_PUBLIC_LANG`

### Performance Considerations

1. **Code Splitting**: Next.js automatically splits code by route
2. **Static Assets**: Images and fonts optimized by Next.js
3. **Data Loading**: 
   - `ingredients_config.json` imported as static data
   - Loaded once at build time
4. **Redux DevTools**: Disabled in production automatically
5. **Memoization**: Selectors prevent unnecessary recalculations

### Bundle Size Optimization

- **Tree Shaking**: Unused code removed automatically
- **Material-UI**: Only imported components included
- **Redux Logger**: Development-only middleware
- **i18next**: Lazy-load translations (future enhancement)

## 🔐 Security Considerations

1. **API Authentication**: Uses public Open Food Facts credentials
2. **Input Validation**: Dataset.tsv controls valid ingredients
3. **XSS Prevention**: React escapes all rendered values
4. **Dependencies**: Regular updates via Dependabot
5. **Content Security**: Next.js security headers (configurable)

## 🔮 Future Architecture Improvements

- [ ] Add server-side caching for API responses
- [ ] Implement service worker for offline support
- [ ] Add analytics integration points
- [ ] Create plugin architecture for custom ingredients
- [ ] Add unit test coverage with Jest
- [ ] Implement E2E tests with Playwright
- [ ] Add performance monitoring (Web Vitals)
- [ ] Create component documentation with Storybook

## 📚 Related Documents

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [API.md](./API.md) - API and data structure details
- [README.md](./README.md) - Project overview and setup

---

*Last Updated: 2026-02-04*
