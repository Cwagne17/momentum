# Design Document

## Overview

This design outlines the approach for removing duplicate `isValidISODateTime` functions from multiple TypeScript files and consolidating them to use the existing centralized implementation in `src/shared/utils/date.ts`. The refactoring will improve code maintainability while preserving all existing functionality.

## Architecture

The current architecture has duplicate `isValidISODateTime` functions in:

- `src/shared/types/asset.ts`
- `src/shared/types/base-document.ts`
- `src/shared/types/liability.ts`
- `src/shared/types/monthly-snapshot.ts`
- `src/shared/types/portfolio.ts`

The target architecture will have:

- Single implementation in `src/shared/utils/date.ts` (already exists)
- All type files importing from the shared utilities
- Consistent validation behavior across the application

## Components and Interfaces

### Existing Components

1. **Centralized Implementation**: `src/shared/utils/date.ts`
   - Already contains `isValidISODateTime` function
   - Exported through `src/shared/utils/index.ts`
   - Implements the same validation logic as duplicates

2. **Type Files with Duplicates**:
   - Each contains identical `isValidISODateTime` helper function
   - Uses the function in Zod schema validation
   - Function is not exported, only used internally

### Target Components

1. **Updated Type Files**:
   - Import `isValidISODateTime` from `src/shared/utils`
   - Remove local duplicate function
   - Use imported function in Zod schemas

2. **Shared Utilities**:
   - No changes needed to the existing implementation
   - Function is already properly exported

## Data Models

No changes to data models are required. The validation schemas will continue to use the same validation function, just imported from a different location.

## Error Handling

The existing error handling will remain unchanged:

- Zod schemas will continue to use the same validation function
- Error messages will remain the same
- Validation behavior will be identical

## Testing Strategy

1. **Regression Testing**:
   - Run existing unit tests to ensure no functionality is broken
   - Verify that all Zod schema validations continue to work correctly

2. **Import Verification**:
   - Ensure all imports resolve correctly
   - Verify no circular dependencies are introduced

3. **Validation Behavior**:
   - Test that validation results are identical before and after refactoring
   - Verify error messages remain consistent

## Implementation Approach

1. **Phase 1**: Update imports in each type file
   - Add import statement for `isValidISODateTime` from `src/shared/utils`
   - Remove local duplicate function
   - Update any references to use imported function

2. **Phase 2**: Verification
   - Run tests to ensure functionality is preserved
   - Check for any TypeScript compilation errors
   - Verify all imports resolve correctly

## Risk Mitigation

- **Import Resolution**: The function is already exported from `src/shared/utils/index.ts`, so imports should resolve correctly
- **Circular Dependencies**: Type files importing from utils should not create circular dependencies
- **Functionality Preservation**: The existing implementation in utils is identical to the duplicates, ensuring no behavior changes
