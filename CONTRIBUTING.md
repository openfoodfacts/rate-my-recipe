# 🤝 Contributing to Rate My Recipe

Thank you for your interest in contributing to Rate My Recipe! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Translation Contributions](#translation-contributions)
- [Issue Reporting](#issue-reporting)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project is part of the Open Food Facts community. We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## 🎯 Ways to Contribute

There are many ways to contribute to Rate My Recipe:

### 💻 Code Contributions
- Bug fixes and feature implementations
- Performance improvements
- UI/UX enhancements
- Test coverage improvements

### 📚 Documentation
- Improving existing documentation
- Adding code examples
- Translating documentation
- Creating tutorials

### 🌍 Translations
- Adding new language translations
- Improving existing translations
- Testing translations in the app

### 🐛 Bug Reports
- Reporting bugs with detailed reproduction steps
- Testing and validating bug fixes

### 💡 Feature Requests
- Suggesting new features
- Discussing feature implementations

## 🛠️ Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
  - We recommend using [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- **Yarn**: Package manager (install via `npm install --global yarn`)

### Step-by-Step Setup

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/rate-my-recipe.git
   cd rate-my-recipe
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

3. **Set Up Environment (Optional)**
   
   To use English translations locally, create a `.env.local` file at the project root:
   ```bash
   NEXT_PUBLIC_LANG=en
   ```

4. **Generate Ingredients Data**
   
   If you modify `dataset.tsv`, regenerate the ingredients configuration:
   ```bash
   yarn parse
   ```

5. **Start Development Server**
   ```bash
   yarn dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server on port 3000 |
| `yarn build` | Build production-ready application |
| `yarn start` | Start production server |
| `yarn lint` | Run ESLint to check code quality |
| `yarn parse` | Parse dataset.tsv and generate ingredients_config.json |

## 📝 Coding Standards

### TypeScript Conventions

- **Type Safety**: Always provide explicit types for function parameters and return values
- **Avoid `any`**: Use specific types or `unknown` instead of `any` when possible
- **Interfaces**: Use interfaces for object shapes and data structures
- **Enums**: Use string enums for better debugging and serialization

Example:
```typescript
// Good
interface IngredientData {
  id: string;
  name: string;
  quantities: string[];
}

function getIngredient(id: string): IngredientData | null {
  // implementation
}

// Avoid
function getIngredient(id: any): any {
  // implementation
}
```

### Component Structure

- **File Organization**: One component per file
- **Component Type**: Use functional components with hooks
- **Props Interface**: Define props interface above the component
- **Naming**: Use PascalCase for components and interfaces

Example:
```typescript
interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: () => void;
  onDelete: () => void;
}

export const IngredientCard = ({ 
  ingredient, 
  onEdit, 
  onDelete 
}: IngredientCardProps) => {
  // Component implementation
};
```

### Redux Patterns

- **Slices**: Use Redux Toolkit's `createSlice` for reducers
- **Async Logic**: Use `createAsyncThunk` for async operations
- **Selectors**: Use `createSelector` from reselect for memoized selectors
- **State Updates**: Always use immutable update patterns

Example:
```typescript
export const updateData = createAsyncThunk(
  'feature/updateData',
  async (params: Params, thunkAPI) => {
    const response = await api.fetchData(params);
    return response.data;
  }
);
```

### Naming Conventions

- **Variables**: `camelCase` for variables and functions
- **Components**: `PascalCase` for React components
- **Files**: `PascalCase.tsx` for components, `camelCase.ts` for utilities
- **Constants**: `UPPER_SNAKE_CASE` for constants
- **CSS**: Use Material-UI's `sx` prop for styling

### Code Style

- **Indentation**: 2 spaces
- **Semicolons**: Use semicolons
- **Quotes**: Use double quotes for strings
- **Line Length**: Prefer lines under 100 characters
- **Comments**: Add JSDoc comments for public functions and complex logic

## 🔀 Git Workflow

### Branch Naming

Use descriptive branch names following this pattern:

```
<type>/<short-description>
```

Types:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `style/` - Code style changes (formatting, etc.)
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feat/add-ingredient-search`
- `fix/nutriscore-calculation`
- `docs/update-readme`

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Test changes
- `chore` - Maintenance tasks

Examples:
```bash
feat(ingredients): add search functionality to ingredient selector
fix(redux): correct nutriscore calculation for recipes
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, maintainable code
   - Follow the coding standards
   - Add JSDoc comments for new functions
   - Test your changes locally

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feat/your-feature-name
   ```

5. **Create Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in the PR template (see below)

### Pull Request Template

When creating a pull request, include:

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Other (please describe)

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots for UI changes

## Testing
- [ ] Tested locally
- [ ] Checked with yarn lint
- [ ] Verified build passes with yarn build

## Related Issues
Closes #issue_number
```

## 🌍 Translation Contributions

Rate My Recipe supports multiple languages through i18next.

### Adding a New Language

1. **Create Translation File**
   
   Create a new JSON file in the `i18n/` directory:
   ```bash
   i18n/[language-code].json
   ```

2. **Copy Structure from English**
   
   Use `i18n/en.json` as a template and translate all keys:
   ```json
   {
     "actions": {
       "add_ingredient": "Your translation",
       "delete": "Your translation"
     },
     "nutriments": {
       "unknown": "Your translation"
     }
   }
   ```

3. **Test Your Translation**
   
   Set the language in `.env.local`:
   ```bash
   NEXT_PUBLIC_LANG=[language-code]
   ```
   
   Run `yarn dev` and verify all strings display correctly.

4. **Submit PR**
   
   Create a pull request with your translation file.

### Translation Guidelines

- **Consistency**: Keep terminology consistent throughout
- **Context**: Consider the context where text appears (buttons, labels, messages)
- **Length**: Be mindful of UI space constraints
- **Formality**: Match the tone of the original English text
- **Special Characters**: Ensure proper encoding of special characters

## 🐛 Issue Reporting

When reporting bugs, please include:

### Bug Report Template

```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
- Device: [e.g. Desktop, Mobile]
- OS: [e.g. Windows, macOS, iOS]

**Additional Context**
Any other context about the problem.
```

### Feature Request Template

```markdown
**Problem Statement**
Describe the problem or need this feature would address.

**Proposed Solution**
Describe your proposed solution or implementation.

**Alternatives Considered**
Describe any alternative solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

## ✅ Before Submitting

- [ ] Code follows the project's coding standards
- [ ] Added JSDoc comments for new functions
- [ ] Tested changes locally with `yarn dev`
- [ ] Ran linter with `yarn lint` and fixed any issues
- [ ] Built successfully with `yarn build`
- [ ] Updated documentation if needed
- [ ] Commit messages follow conventional commits format
- [ ] PR description is clear and complete

## 🙏 Thank You!

Thank you for contributing to Rate My Recipe! Your contributions help make nutrition information more accessible and help users make better food choices.

## 📞 Need Help?

- **GitHub Discussions**: Ask questions in [GitHub Discussions](https://github.com/openfoodfacts/rate-my-recipe/discussions)
- **GitHub Issues**: Report bugs or request features
- **Open Food Facts**: Join the [Open Food Facts community](https://world.openfoodfacts.org)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Material-UI Joy Documentation](https://mui.com/joy-ui/getting-started/)
- [Open Food Facts API](https://world.openfoodfacts.org/api/v3)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
