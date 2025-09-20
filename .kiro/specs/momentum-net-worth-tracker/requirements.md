# Requirements Document

## Introduction

Momentum is a desktop application built with Electron and TypeScript/React that enables users to manually track their personal net worth and financial health. The application focuses on simplicity and motivation, allowing users to enter monthly financial snapshots and visualize their progress through intuitive charts and metrics. Data is stored locally in JSON format using a Kubernetes-style schema within user-selected portfolio folders to ensure privacy and persistence without requiring external services.

## Requirements

### Requirement 1

**User Story:** As a user, I want to manually enter monthly financial snapshots, so that I can track my net worth progress over time.

#### Acceptance Criteria

1. WHEN a user selects a month THEN the system SHALL display a data entry form pre-filled with the previous month's values
2. WHEN the system pre-fills previous month values THEN the system SHALL clearly indicate to the user that these are prior month values to prevent accidental oversight
3. WHEN a user creates a new monthly snapshot THEN the system SHALL allow entry of all assets and liabilities for that month
4. WHEN a user saves a monthly snapshot THEN the system SHALL store the data locally in JSON format
5. WHEN a user needs to correct data THEN the system SHALL allow editing of any previous month's values
6. WHEN a user is filling out a monthly snapshot THEN the system SHALL allow adding new asset and liability entries as needed
7. IF no prior month data exists THEN the system SHALL present empty forms for initial data entry

### Requirement 2

**User Story:** As a user, I want to manage my asset and liability entries with proper categorization, so that I can organize my financial data effectively.

#### Acceptance Criteria

1. WHEN a user adds an asset entry THEN the system SHALL provide types: Cash, Retirement Investment, Non-retirement Investment, Property, Vehicle, Other Asset
2. WHEN a user adds a liability entry THEN the system SHALL provide types: Credit Card, Car Loan, Student Loan, Medical Bills, Personal Loan, Mortgage, Other Liability
3. WHEN a user creates an asset entry THEN the system SHALL automatically set liquidity flag based on sensible defaults (Cash = liquid, Vehicle = illiquid, Retirement Investment = illiquid, Non-retirement Investment = liquid)
4. WHEN a user wants to archive an entry THEN the system SHALL provide an archive action that hides it from active use while preserving historical data
5. WHEN a user is viewing entries during data entry THEN the system SHALL display archive options as action items rather than edit options
6. WHEN a user updates values for an asset or liability THEN the system SHALL treat this as creating an entry for that data type

### Requirement 3

**User Story:** As a user, I want the system to automatically calculate financial totals and ratios, so that I can understand my financial position without manual computation.

#### Acceptance Criteria

1. WHEN financial data is entered THEN the system SHALL calculate total assets, total liabilities, and net worth
2. WHEN assets are present THEN the system SHALL group and subtotal by type (Cash, Retirement Investment, Non-retirement Investment, Property, Vehicle, Other Asset)
3. WHEN liabilities are present THEN the system SHALL group and subtotal by type (Credit Card, Car Loan, Student Loan, Medical Bills, Personal Loan, Mortgage, Other Liability)
4. WHEN assets are present THEN the system SHALL calculate liquid vs illiquid asset totals
5. WHEN liquid assets and liabilities exist THEN the system SHALL calculate Liquid Net Worth (liquid assets - total liabilities)
6. WHEN assets and liabilities exist THEN the system SHALL calculate Debt-to-Asset Ratio
7. WHEN multiple months of data exist THEN the system SHALL calculate month-over-month changes (dollar amount and percentage)
8. WHEN data spans multiple years THEN the system SHALL calculate year-over-year changes (dollar amount and percentage)

### Requirement 4

**User Story:** As a user, I want to view my financial progress through visual dashboards and charts, so that I can quickly understand trends and current status.

#### Acceptance Criteria

1. WHEN the dashboard loads THEN the system SHALL display key metric cards showing current net worth with MoM and YoY changes
2. WHEN the dashboard loads THEN the system SHALL display cards for Total Assets, Total Liabilities, and Liquid Net Worth
3. WHEN historical data exists THEN the system SHALL display a net worth trend chart with actual history as a solid line
4. WHEN sufficient historical data exists THEN the system SHALL display a dashed regression line projecting 12-24 months forward
5. WHEN asset data exists THEN the system SHALL display a donut chart showing asset breakdown by type
6. WHEN asset data exists THEN the system SHALL display a donut chart showing liquid vs illiquid assets
7. WHEN liability data exists THEN the system SHALL display a donut chart showing liability breakdown by type
8. WHEN the user requests it THEN the system SHALL display an optional data table with columns: Month, Assets, Liabilities, Net Worth, Liquid NW, ΔMoM, ΔYoY
9. WHEN viewing charts and trends THEN the system SHALL provide time range options: YTD, 1Y, 5Y, 10Y, and ALL

### Requirement 5

**User Story:** As a user, I want my financial data to be securely stored locally with backup capabilities, so that my privacy is protected and my data is safe.

#### Acceptance Criteria

1. WHEN data is saved THEN the system SHALL store all information in local JSON files using Kubernetes-style schema (apiVersion, kind, metadata, spec)
2. WHEN a save operation occurs THEN the system SHALL automatically create timestamped backup copies
3. WHEN a user requests data export THEN the system SHALL provide CSV export of all snapshots
4. WHEN a user requests data import THEN the system SHALL allow JSON restore from backup files
5. WHEN the application starts THEN the system SHALL validate the JSON schema version and handle migrations if needed
6. WHEN a user creates a new portfolio THEN the system SHALL allow selection of a folder in their filesystem to store the data
7. WHEN a user opens an existing portfolio THEN the system SHALL allow selection of a portfolio folder and load that data
8. WHEN a portfolio is selected THEN the system SHALL remember the portfolio location for future sessions

### Requirement 6

**User Story:** As a user, I want a simple and intuitive interface that focuses on essential functionality, so that I can efficiently manage my financial tracking without complexity.

#### Acceptance Criteria

1. WHEN the application launches THEN the system SHALL present a clean dashboard as the primary interface
2. WHEN navigating the application THEN the system SHALL provide clear visual hierarchy and intuitive navigation patterns
3. WHEN performing data entry THEN the system SHALL minimize required clicks and keystrokes
4. WHEN viewing financial data THEN the system SHALL use consistent formatting for currency (USD only)
5. WHEN errors occur THEN the system SHALL provide clear, actionable error messages
6. WHEN the application loads THEN the system SHALL respond within 2 seconds for typical datasets

### Requirement 7

**User Story:** As a user, I want the application to be designed for future extensibility, so that additional features can be added without major restructuring.

#### Acceptance Criteria

1. WHEN the data model is designed THEN the system SHALL support future addition of multiple currencies
2. WHEN the storage system is implemented THEN the system SHALL support future encryption capabilities
3. WHEN the calculation engine is built THEN the system SHALL allow for future scenario planning features
4. WHEN the UI is structured THEN the system SHALL accommodate future advanced visualization options
5. WHEN the asset and liability entry system is designed THEN the system SHALL support future custom entry types
