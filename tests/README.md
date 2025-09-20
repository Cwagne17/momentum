# Tests Directory

This directory contains all test files for the Momentum Net Worth Tracker application, organized by test type and following the source code structure.

## Directory Structure

```
tests/
├── unit/                    # Unit tests
│   └── shared/
│       ├── types/          # Type definition and validation tests
│       └── utils/          # Utility function tests
├── e2e/                    # End-to-end tests (future)
├── integration/            # Integration tests (future)
├── mocks/                  # Mock data and test fixtures
│   └── portfolio-data.ts   # Sample portfolio data for testing
└── README.md              # This file
```

## Test Organization

### Unit Tests (`tests/unit/`)

Unit tests are organized to mirror the source code structure:

- **`shared/types/`**: Tests for TypeScript interfaces, enums, and Zod validation schemas
  - `base-document.test.ts`: Base document types and schemas
  - `portfolio.test.ts`: Portfolio types and validation
  - `asset.test.ts`: Asset types and validation
  - `liability.test.ts`: Liability types and validation
  - `entry.test.ts`: Entry types and validation
  - `monthly-snapshot.test.ts`: Monthly snapshot types and validation
  - `calculations.test.ts`: Financial calculation types and validation
  - `validation-helpers.test.ts`: Validation utility functions

- **`shared/utils/`**: Tests for utility functions
  - `uuid.test.ts`: UUID generation and validation utilities
  - `date-utils.test.ts`: Date manipulation and formatting utilities

### Mock Data (`tests/mocks/`)

Mock data files provide realistic test data for use across different test suites:

- **`portfolio-data.ts`**: Complete mock portfolio with assets, liabilities, and monthly snapshots

## Running Tests

### All Tests

```bash
npm test
```

### Unit Tests Only

```bash
npm test -- --testPathPattern="tests/unit"
```

### Specific Test Suite

```bash
npm test -- tests/unit/shared/types/portfolio.test.ts
```

### With Coverage

```bash
npm test -- --coverage
```

### Watch Mode

```bash
npm test -- --watch
```

## Test Conventions

### File Naming

- Test files should end with `.test.ts` or `.spec.ts`
- Test files should be named after the module they test
- Mock files should be descriptive of their content

### Test Structure

- Use `describe` blocks to group related tests
- Use descriptive test names that explain the expected behavior
- Include both positive and negative test cases
- Test edge cases and error conditions

### Mock Data

- Use realistic data that represents actual use cases
- Include proper UUIDs and valid dates
- Provide both valid and invalid examples for validation testing

## Future Test Types

### Integration Tests (`tests/integration/`)

Will test interactions between different modules:

- File system operations with portfolio management
- IPC communication between main and renderer processes
- Data flow from file system to UI components

### End-to-End Tests (`tests/e2e/`)

Will test complete user workflows:

- Portfolio creation and management
- Monthly snapshot data entry
- Chart visualization and data export
- Error handling and recovery scenarios
