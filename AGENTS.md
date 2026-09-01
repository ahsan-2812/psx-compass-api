# PSX Compass API Guidance

## Required project context

Before planning or implementing product functionality, read:

1. `docs/PRODUCT_SCOPE.md` for the approved product boundary and principles.
2. `docs/ROADMAP.md` for milestone order, dependencies, and completion criteria.

Do not silently remove approved scope, pull deferred functionality into the active milestone, or
change roadmap order without documenting the reason and confirming any material product decision.

## Product

PSX Compass is a complete Pakistan Stock Exchange portfolio-management and investor platform.
Valuation is one module, not the entire product. Portfolio accounting is the core domain.

## Confirmed stack

- Node.js, Express, and TypeScript
- Sequelize with Microsoft SQL Server
- npm
- Modular monolith architecture

## Engineering rules

- Keep controllers and route handlers thin.
- Put business rules in domain/application services.
- Keep Sequelize-specific persistence behind repositories.
- Use database transactions for operations that modify portfolio state.
- Never use JavaScript floating-point arithmetic for money or share quantities.
- Store financial quantities with suitable SQL Server `DECIMAL` precision and use decimal-safe
  application calculations.
- Portfolio transactions form an auditable ledger. Do not silently rewrite financial history.
- Keep global market data separate from user-entered overrides and portfolio records.
- Version valuation rules so historical results remain reproducible.
- Every automated financial field must retain source and freshness metadata.
- Keep roadmap checkboxes accurate when a feature is actually completed and verified.

## Initial product modules

- Authentication and users
- Companies and PSX instruments
- Portfolios, transactions, holdings, and cash ledger
- Dividends and corporate actions
- Market data and financial statements
- Watchlists and alerts
- Portfolio analytics and reports
- NORMAL, BANK, and REIT valuation engines
- Subscription plans later
