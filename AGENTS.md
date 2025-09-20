# AI Agent Instructions for Momentum

## What is Momentum?

**Momentum** is a desktop application for manual monthly net worth tracking. It provides individuals with a private, secure way to monitor their financial progress over time without relying on external services or automatic bank connections.

### Core Purpose

- **Manual Data Entry**: Users manually input asset and liability values each month
- **Historical Tracking**: Maintains detailed financial history with month-over-month comparisons
- **Trend Analysis**: Visualizes net worth trends with regression analysis and projections
- **Privacy-First**: All data stored locally with no cloud dependencies
- **Professional Interface**: Modern, trustworthy fintech aesthetic

### Target Users

- Individuals who prefer manual control over financial data
- Privacy-conscious users who want local data storage
- People with complex financial situations requiring custom categorization
- Users who want detailed historical analysis and projections

## Technology Stack

### Core Technologies

- **Electron**: Cross-platform desktop application framework
- **React 18+**: User interface with modern hooks and patterns
- **TypeScript 5+**: Strict typing for reliability and developer experience
- **Node.js**: Backend services and file system operations

### State & Data Management

- **Zustand**: Lightweight React state management
- **JSON Files**: Local file system persistence (human-readable, version-control friendly)
- **Recharts**: React-based charting and data visualization

### UI & Styling

- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Muted Color Palette**: Professional slate/blue-gray theme for trustworthy appearance
- **Inter Font**: Clean, readable typography optimized for financial data

### Development Tools

- **Vite**: Fast build tool and development server
- **Jest**: Unit testing framework
- **ESLint + Prettier**: Code quality and formatting
- **Electron Builder**: Application packaging and distribution

## Design Philosophy

### Visual Design

- **Muted & Professional**: Slate-based color palette that conveys trust and reliability
- **Clean Typography**: Clear hierarchy with Inter font family
- **Spacious Layout**: Generous whitespace and consistent spacing
- **Data-Focused**: Charts and numbers are the primary visual elements
- **Accessibility**: WCAG 2.1 AA compliance for inclusive design

### User Experience

- **Simplicity**: Three main screens (Dashboard, Snapshots, Holdings)
- **Manual Control**: User has full control over all data entry and categorization
- **Historical Context**: Easy access to trends and month-over-month comparisons
- **Efficient Workflows**: Streamlined monthly update process
- **Error Prevention**: Validation and confirmation for data changes

## Ground Truth Documentation

All development work MUST reference these authoritative sources:

### Primary Specifications (`.kiro/specs/momentum-net-worth-tracker/` directory)

1. **`.kiro/specs/momentum-net-worth-tracker/requirements.md`** - Functional requirements and user stories
2. **`.kiro/specs/momentum-net-worth-tracker/design.md`** - Visual design and UX specifications
3. **`.kiro/specs/momentum-net-worth-tracker/tasks.md`** - Current development tasks and priorities

### Technical Standards (`.builder/rules/` directory)

1. **`00-index.mdc`** - Overview of all builder rules
2. **`01-tech-stack.mdc`** - Technology choices and architecture
3. **`02-design-system.mdc`** - Visual design system and components
4. **`03-data-model.mdc`** - Data structures and business logic
5. **`04-ui-architecture.mdc`** - Screen layouts and state management
6. **`05-coding-standards.mdc`** - Code quality and development practices
7. **`06-sources-and-grounding.mdc`** - Documentation requirements and validation
8. **`07-tasks-and-scopes.mdc`** - Task management and definition of done

## Instructions for AI Agents

### Mandatory Pre-Development Process

**BEFORE generating any code, ALWAYS:**

1. **Read `.kiro/specs/momentum-net-worth-tracker/requirements.md`** to understand what features are required
2. **Read `.kiro/specs/momentum-net-worth-tracker/design.md`** to understand how features should look and behave
3. **Check `.kiro/specs/momentum-net-worth-tracker/tasks.md`** to understand current priorities and task context
4. **Reference relevant `.builder/rules/`** files for technical implementation guidance

### Code Generation Rules

#### What You MUST Do

- ✅ **Ground all work** in the specifications found in `.kiro/specs/momentum-net-worth-tracker/` directory
- ✅ **Follow technical standards** from `.builder/rules/` directory
- ✅ **Use the muted color palette** defined in design system (slate/blue-gray)
- ✅ **Implement TypeScript** with strict typing and proper interfaces
- ✅ **Include comprehensive tests** for all new functionality
- ✅ **Reference ground truth documents** in code comments and commit messages
- ✅ **Validate data integrity** for all financial calculations
- ✅ **Follow accessibility guidelines** for inclusive design

#### What You MUST NOT Do

- ❌ **Never invent features** not documented in `.kiro/specs/momentum-net-worth-tracker/requirements.md`
- ❌ **Never create UI elements** without design guidance from `.kiro/specs/momentum-net-worth-tracker/design.md`
- ❌ **Never ignore current tasks** defined in `.kiro/specs/momentum-net-worth-tracker/tasks.md`
- ❌ **Never use cloud services** or external APIs for data storage
- ❌ **Never implement automatic data connections** (bank APIs, financial services)
- ❌ **Never compromise user privacy** or data locality
- ❌ **Never use bright or vibrant colors** that break the muted aesthetic

### Implementation Patterns

#### TypeScript Usage

```typescript
// Always use strict typing
interface Portfolio {
  id: string;
  name: string;
  assets: Asset[];
  liabilities: Liability[];
}

// Reference ground truth in comments
/**
 * Calculates net worth per requirements in .kiro/specs/momentum-net-worth-tracker/requirements.md
 * Implementation follows .builder/rules/03-data-model.mdc
 */
function calculateNetWorth(assets: Asset[], liabilities: Liability[]): number {
  // Implementation
}
```

#### React Component Structure

```typescript
// Follow component patterns from .builder/rules/05-coding-standards.mdc
interface NetWorthDisplayProps {
  portfolio: Portfolio;
  showTrend?: boolean;
}

export const NetWorthDisplay: React.FC<NetWorthDisplayProps> = ({
  portfolio,
  showTrend = true
}) => {
  // Implementation following design system colors from 02-design-system.mdc
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
      {/* Component implementation */}
    </div>
  );
};
```

#### Commit Message Format

```
feat(dashboard): implement net worth calculation display

Implements requirements from .kiro/specs/momentum-net-worth-tracker/requirements.md (Dashboard section)
Follows design specifications from .kiro/specs/momentum-net-worth-tracker/design.md (Net Worth Display)
Completes Task #12 from .kiro/specs/momentum-net-worth-tracker/tasks.md

Technical implementation per .builder/rules/03-data-model.mdc
- Add calculateNetWorth function with proper TypeScript types
- Include comprehensive unit tests
- Use muted color palette from design system
```

### Quality Assurance

#### Before Submitting Code

- [ ] **Requirements validation**: Code implements documented requirements
- [ ] **Design compliance**: UI matches design specifications
- [ ] **Task alignment**: Work addresses current task priorities
- [ ] **Technical standards**: Code follows established patterns and rules
- [ ] **Test coverage**: Includes unit and integration tests
- [ ] **TypeScript compliance**: No type errors or warnings
- [ ] **Accessibility**: Meets WCAG 2.1 AA standards
- [ ] **Documentation**: Complex logic is documented with comments

#### Error Handling

If specifications are unclear or missing:

1. **Stop code generation** immediately
2. **Ask specific questions** about requirements, design, or tasks
3. **Reference the specific document** that needs clarification
4. **Suggest improvements** to documentation if gaps are identified
5. **Do not assume or invent** missing specifications

### Collaboration Guidelines

#### With Human Developers

- **Reference ground truth documents** in all technical discussions
- **Validate understanding** of requirements before implementation
- **Ask for clarification** when specifications are ambiguous
- **Suggest improvements** to processes and documentation

#### With Other AI Agents

- **Share grounding context** from `.kiro/specs/momentum-net-worth-tracker/` directory
- **Maintain consistency** in technical approaches and patterns
- **Validate cross-dependencies** when working on related features
- **Ensure coherent user experience** across all implementations

## Development Workflow

### Typical Development Cycle

1. **Review task** in `.kiro/specs/momentum-net-worth-tracker/tasks.md` for current priorities
2. **Read requirements** from `.kiro/specs/momentum-net-worth-tracker/requirements.md` for feature context
3. **Check design** in `.kiro/specs/momentum-net-worth-tracker/design.md` for UI/UX guidance
4. **Reference technical standards** from appropriate `.builder/rules/` files
5. **Implement feature** following established patterns
6. **Write comprehensive tests** for all new functionality
7. **Update documentation** if specifications change
8. **Validate against ground truth** before completion

### Communication Standards

- **Always reference source documents** when discussing features or changes
- **Include specific section references** when citing requirements or design
- **Document assumptions** when specifications are unclear
- **Propose specification updates** when gaps are discovered

## Success Metrics

Your success as an AI agent working on Momentum is measured by:

- **Specification adherence**: How well implementations match documented requirements and design
- **Code quality**: TypeScript compliance, test coverage, and adherence to coding standards
- **User experience consistency**: Maintaining the muted, professional aesthetic and interaction patterns
- **Documentation accuracy**: Keeping implementation aligned with ground truth sources
- **Privacy preservation**: Ensuring all data remains local and secure

## Getting Started

1. **Familiarize yourself** with all documents in `.kiro/specs/momentum-net-worth-tracker/` directory
2. **Review technical standards** in `.builder/rules/` directory
3. **Understand the muted design aesthetic** and color palette
4. **Practice referencing ground truth** in code comments and commits
5. **Start with small tasks** to learn the patterns and validation process

Remember: Momentum is a privacy-focused, locally-controlled financial application. Every decision should prioritize user control, data locality, and the professional, trustworthy aesthetic that users expect from financial software.
