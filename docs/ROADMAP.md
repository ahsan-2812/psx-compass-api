# PSX Compass Development Roadmap

## Roadmap rules

- Complete milestones in order unless a documented dependency requires otherwise.
- Do not implement later automation on top of unverified portfolio calculations.
- Every accounting feature requires focused unit tests, boundary tests, and auditability.
- A milestone is complete only when its migrations, API behavior, tests, documentation, and error
  handling are complete.
- Keep the Express application a modular monolith until demonstrated scaling needs justify a split.

## Milestone 0 - API foundation

Status: In progress

- [x] Express and TypeScript application
- [x] Sequelize and SQL Server connection
- [x] Environment validation
- [x] Structured logging
- [x] Liveness and readiness endpoints
- [x] Global not-found and error handling
- [x] Graceful shutdown
- [x] Type checking, linting, formatting, and test runner
- [x] Repository-level Codex guidance
- [x] Sequelize migration system
- [x] Migration conventions and commands
- [ ] CI verification workflow

## Milestone 1 - Accounting foundation

### Database and security master

- [ ] Establish migration and model conventions
- [ ] Create sector and PSX security-master tables
- [ ] Add security type, listing status, Shariah status, and valuation-engine classification
- [ ] Add company-data provenance and freshness fields
- [ ] Seed an initial validated company dataset

### Users and authentication

- [ ] User registration
- [ ] Login and logout
- [ ] Password hashing
- [ ] Access and rotating refresh tokens
- [ ] Forgot-password and reset-password flows
- [ ] User profile and preferences
- [ ] Authentication rate limiting and security tests

### Portfolios and cash

- [ ] Multiple portfolios per user
- [ ] Portfolio create, read, update, archive, and restore
- [ ] Portfolio ownership authorization
- [ ] Cash ledger
- [ ] Deposits, withdrawals, and adjustments
- [ ] PKR as the initial currency

### Transactions and holdings

- [ ] Buy and sell transaction ledger
- [ ] Fees, commissions, taxes, trade date, and settlement date
- [ ] Broker reference and notes
- [ ] Immutable transaction identity and audit metadata
- [ ] Lot-level preservation
- [ ] Weighted-average holdings calculation
- [ ] Realized and unrealized gain/loss
- [ ] Remaining quantity and cost basis
- [ ] Negative-holding and oversell prevention
- [ ] Portfolio summary endpoints
- [ ] Comprehensive decimal-safe calculation tests

### Milestone 1 exit criteria

- A user can securely manage multiple portfolios.
- Buy, sell, cash, fee, and tax activity produces reproducible balances.
- Holdings can be fully rebuilt from the ledger.
- Accounting tests cover partial sales, multiple lots, fees, taxes, and invalid transactions.

## Milestone 2 - Investor workflow

### Income and corporate actions

- [ ] Manual dividends
- [ ] Gross, tax, and net dividend tracking
- [ ] Bonus shares
- [ ] Rights shares
- [ ] Stock splits
- [ ] Auditable corporate-action adjustments

### Watchlists and market prices

- [ ] Multiple watchlists
- [ ] Target prices and notes
- [ ] Market-price ingestion adapter
- [ ] Source priority, retry, and circuit-breaker behavior
- [ ] Price freshness and data-quality statuses
- [ ] Market calendar with weekends and Pakistan public holidays

### Dashboard and history

- [ ] Portfolio dashboard
- [ ] Daily, realized, unrealized, dividend, and total returns
- [ ] Company and sector allocation
- [ ] Largest holdings and best/worst performers
- [ ] Portfolio snapshots and monthly history
- [ ] Basic exportable reports

### Milestone 2 exit criteria

- Users can manage complete manual investor workflows.
- Market-price failures are visible and never silently produce misleading results.
- Dashboard figures reconcile with ledger and holdings calculations.

## Milestone 3 - Automated portfolio synchronization

### Import pipeline

- [ ] CSV and Excel imports
- [ ] Broker PDF import
- [ ] Screenshot import
- [ ] AI-assisted extraction where deterministic parsing is insufficient
- [ ] Import preview and correction
- [ ] Duplicate detection and idempotency
- [ ] Import source-document references
- [ ] Import audit log
- [ ] Failure-review queue

### Email and event automation

- [ ] Dedicated import-email design
- [ ] Broker email synchronization
- [ ] Broker-specific parser adapters
- [ ] Automatic dividend detection
- [ ] Corporate-action automation
- [ ] Safe retry and poison-message handling

### Milestone 3 exit criteria

- Reprocessing the same source never duplicates financial activity.
- No extracted transaction enters the ledger without validation.
- Users can review and correct uncertain imports.

## Milestone 4 - Pakistan investor tools

### Tax

- [ ] FIFO lot allocation
- [ ] Pakistan CGT calculations
- [ ] Tax-year reporting
- [ ] Brokerage, commission, CVT, WHT, and dividend-tax treatment
- [ ] Versioned tax rules and effective dates
- [ ] Exportable tax-support reports

### Zakat and purification

- [ ] Zakat-rule definition and effective-date versioning
- [ ] Zakatable portfolio-value calculation
- [ ] Company-level purification inputs
- [ ] Purification calculation
- [ ] Evidence, assumptions, and user-facing disclaimers

### Milestone 4 exit criteria

- Tax and Zakat results are reproducible from stored versioned rules and source data.
- Reports disclose assumptions and do not present themselves as official filing or religious rulings.

## Milestone 5 - Research and valuation

### Financial-data platform

- [ ] Annual and quarterly financial statements
- [ ] TTM EPS and DPS calculations
- [ ] Official PSX source adapter
- [ ] Mirror and fallback adapters
- [ ] Per-field provenance and freshness
- [ ] Retry, circuit breaker, caching, and anomaly detection
- [ ] Manual overrides separated from sourced data

### Valuation engines

- [ ] Versioned normal-company engine
- [ ] Versioned bank and investment-company engine
- [ ] Versioned REIT engine
- [ ] Preferred buy, accumulate, base fair value, and upper fair value
- [ ] Margin of safety, growth, risk, confidence, and recommendation
- [ ] One-off earnings detection
- [ ] Defensive negative-growth handling
- [ ] Valuation history and reproducibility

### Research experience

- [ ] Stock screener
- [ ] Company comparison
- [ ] Detailed company pages
- [ ] Portfolio-level valuation view
- [ ] Investment journal and thesis reviews
- [ ] Target allocation and rebalancing suggestions

### Milestone 5 exit criteria

- Every valuation result identifies its engine version, inputs, sources, freshness, and warnings.
- Portfolio valuation never modifies portfolio accounting history.

## Milestone 6 - Alerts, mobile, and commercial release

### Alerts and notifications

- [ ] Price and volume alerts
- [ ] Dividend and valuation alerts
- [ ] Portfolio milestone and concentration alerts
- [ ] Mobile push notifications
- [ ] Notification preferences and delivery audit

### Product release

- [ ] Android and iOS client release plan
- [ ] Free and paid subscription plans
- [ ] Feature and usage limits
- [ ] Account export and deletion
- [ ] Family sharing and read-only adviser access
- [ ] Production monitoring and backups
- [ ] Privacy, security, and incident-response review
- [ ] Market-data licensing review
- [ ] Support and operational workflows

### Milestone 6 exit criteria

- The commercial product is secure, observable, supportable, and clear about data rights and
  investment limitations.

## Deferred ideas

These require a separate scope decision and are not part of the approved initial roadmap:

- Direct broker order placement
- Automated trading
- Intraday technical-analysis platform
- Mutual funds
- Cryptocurrency, forex, or international securities
- Social/community functionality
- Autonomous AI investment decisions
