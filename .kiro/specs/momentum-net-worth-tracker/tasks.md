# Implementation Plan

- [x] 1. Initialize project structure and development environment
  - Create package.json with Electron, React, TypeScript, and build tool dependencies
  - Set up project folder structure (src/main, src/renderer, src/shared)
  - Configure TypeScript with separate configs for main and renderer processes
  - Initialize Electron main process entry point and basic window creation
  - Set up development scripts for concurrent main/renderer development
  - _Requirements: 6.1, 6.2_

- [x] 2. Configure build system and development tools
  - Set up Vite or Webpack for renderer process bundling with TypeScript support
  - Configure Electron Builder for packaging and distribution
  - Add ESLint and Prettier for code quality and formatting
  - Set up Jest testing framework with TypeScript support
  - Create development and production build scripts
  - _Requirements: 6.1, 6.2_

- [x] 3. Install and configure UI framework dependencies
  - Install Material-UI (MUI) v5+ with emotion styling engine
  - Install MUI X Charts for data visualizations
  - Install and configure Tailwind CSS for utility styling
  - Install Zod for runtime schema validation
  - Create MUI custom theme configuration with design system colors
  - _Requirements: 6.1, 6.2_

- [ ] 4. Implement core data models and validation schemas
  - Create TypeScript interfaces for BaseDocument, Asset, Liability, Entry, and MonthlySnapshot
  - Implement Zod schemas for runtime validation of all data models
  - Create DocumentKind enum and BaseDocumentClass abstract class
  - Add utility functions for UUID generation and date handling
  - Write unit tests for data model validation and serialization
  - _Requirements: 2.1, 2.2, 2.3, 5.1, 5.5_

- [ ] 5. Build file system operations and portfolio management (Main Process)
  - Implement PortfolioManager class for creating and opening portfolios
  - Create file system utilities for reading/writing JSON files with proper error handling
  - Implement schema validation and migration system for different API versions
  - Add automatic backup creation on save operations with timestamped folders
  - Write unit tests for file operations and error scenarios
  - _Requirements: 5.1, 5.2, 5.5, 5.6, 5.7, 5.8_

- [ ] 6. Create IPC communication layer
  - Set up IPC channels between main and renderer processes
  - Implement secure communication for portfolio operations (create, open, save)
  - Add error handling and validation for IPC messages
  - Create TypeScript types for IPC message contracts
  - Write integration tests for main-renderer communication
  - _Requirements: 5.6, 5.7, 5.8_

- [ ] 7. Implement DataService for portfolio data management (Renderer Process)
  - Create DataService class with methods for loading portfolios and managing snapshots
  - Implement getSnapshot(year, month) and getSnapshots(start?, end?) methods
  - Add saveSnapshot functionality with proper validation
  - Implement exportPortfolio method supporting CSV and JSON formats
  - Write unit tests for all DataService methods
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 5.3, 5.4_

- [ ] 8. Build calculation engine with granular functions
  - Implement CalculationEngine class with individual calculation methods
  - Create calculateAssets, calculateLiabilities, calculateNetWorth functions with DateRange support
  - Add calculateLiquidAssets, calculateIlliquidAssets, calculateLiquidNetWorth methods
  - Implement calculateAssetsByType and calculateLiabilitiesByType functions
  - Add calculateDeltas and calculateRatios methods
  - Write comprehensive unit tests for all calculation scenarios
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 9. Create basic React application structure
  - Set up React Router for navigation between portfolio selection and main app
  - Create Portfolio Context for global state management using useReducer
  - Implement basic App component with routing and context providers
  - Add error boundary components for graceful error handling
  - Create basic layout components with MUI AppBar and navigation
  - _Requirements: 6.1, 6.2, 6.5_

- [ ] 10. Implement portfolio selection and management UI
  - Create portfolio selection screen for opening existing portfolios
  - Build new portfolio creation wizard with folder selection dialog
  - Implement recent portfolios list with quick access
  - Add portfolio switching functionality
  - Store portfolio preferences in localStorage for future sessions
  - Write component tests for portfolio management workflows
  - _Requirements: 5.6, 5.7, 5.8_

- [ ] 11. Create asset and liability management components
  - Build Asset creation form using MUI TextField and Select components
  - Create Liability creation form with proper type selection
  - Implement automatic liquidity flag setting based on asset type defaults
  - Add archive functionality as action items rather than edit options
  - Style components with Tailwind CSS for consistent layout
  - Write component tests for form validation and user interactions
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 12. Implement monthly snapshot data entry interface
  - Create monthly snapshot form with MUI components for data entry
  - Implement pre-filling of previous month values with clear visual indicators
  - Add ability to edit previous months' data through navigation
  - Enable adding new assets and liabilities during snapshot creation
  - Implement form validation and error handling
  - Write component tests for data entry workflows
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7_

- [ ] 13. Build dashboard with key metric cards
  - Create dashboard layout using MUI Card components and Tailwind CSS grid
  - Implement metric cards for Net Worth, Total Assets, Total Liabilities, Liquid Net Worth
  - Add MoM and YoY change indicators with proper formatting
  - Integrate with CalculationEngine for real-time calculations
  - Add responsive design for different screen sizes
  - Write component tests for metric display and calculations
  - _Requirements: 4.1, 4.2, 6.1, 6.2, 6.4_

- [ ] 14. Implement chart visualizations with MUI X Charts
  - Create Net Worth trend chart using MUI LineChart with historical data
  - Add regression line projection for 12-24 months forward
  - Build asset breakdown pie chart using MUI PieChart with type groupings
  - Create liability breakdown pie chart with proper styling
  - Implement liquid vs illiquid asset pie chart
  - Add time range selector using MUI ToggleButtonGroup (YTD, 1Y, 5Y, 10Y, ALL)
  - Write component tests for chart rendering and interactions
  - _Requirements: 4.3, 4.4, 4.5, 4.6, 4.7, 4.9_

- [ ] 15. Add optional data table view
  - Create data table using MUI DataGrid with columns: Month, Assets, Liabilities, Net Worth, Liquid NW, ΔMoM, ΔYoY
  - Implement sorting and filtering capabilities
  - Add export functionality for table data
  - Style table with Tailwind CSS for consistent appearance
  - Write component tests for table functionality
  - _Requirements: 4.8_

- [ ] 16. Add comprehensive error handling and user feedback
  - Implement error boundaries for React components
  - Create user-friendly error messages for common scenarios
  - Add loading states and progress indicators for file operations
  - Implement graceful degradation for missing data
  - Add success notifications for save operations using MUI Snackbar
  - Write tests for error scenarios and recovery
  - _Requirements: 6.5, 6.6_

- [ ] 17. Implement data export and import functionality
  - Create CSV export functionality with proper formatting
  - Add JSON export for complete portfolio backup
  - Implement JSON import with validation and error handling
  - Add file selection dialogs for import/export operations
  - Write integration tests for export/import workflows
  - _Requirements: 5.3, 5.4_

- [ ] 18. Add application performance optimizations
  - Implement data caching for frequently accessed calculations
  - Add lazy loading for large datasets and charts
  - Optimize chart rendering performance for large time ranges
  - Add debouncing for user input in forms
  - Write performance tests for large portfolio datasets
  - _Requirements: 6.6_

- [ ] 19. Create comprehensive test suite
  - Write end-to-end tests for complete user workflows using Playwright or similar
  - Add integration tests for file system operations
  - Create performance tests with large datasets (10+ years of data)
  - Implement automated testing for different portfolio scenarios
  - Add tests for error handling and edge cases
  - _Requirements: All requirements validation_

- [ ] 20. Final integration and polish
  - Integrate all components into cohesive application flow
  - Apply consistent styling and theming throughout the application
  - Add keyboard shortcuts and accessibility features
  - Implement application settings and preferences
  - Perform final testing and bug fixes
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
