# PSX Compass Product Scope

## Product vision

PSX Compass is a complete Pakistan Stock Exchange portfolio-management, market-data,
performance-analysis, taxation, Zakat, research, and valuation platform for individual and family
investors.

The product should provide portfolio-automation capabilities comparable to SmartPSX while adding
PSX Compass's own valuation and long-term investment-decision system. Valuation is an important
differentiator, but portfolio accounting remains the core domain.

PSX Compass must not copy another product's code, protected content, branding, or exact interface.

## Target users

Initial users:

- Individual long-term PSX investors
- Investors managing their own and family portfolios
- Investors focused on dividends and actual total returns
- Investors seeking valuation guidance
- Investors replacing spreadsheets with a reliable system

Not initially targeted:

- Brokers
- Institutional fund managers
- Day traders
- Automated-trading users
- Users expecting direct broker execution

## Core product areas

1. Portfolio Management
2. Market and Company Data
3. Performance Analytics
4. Valuation and Research
5. Investor Utilities

## Functional scope

### Accounts and access

- Register, log in, log out, and refresh sessions
- Forgot-password and reset-password flows
- User profile and preferences
- Secure synchronization across devices
- Account export and deletion
- Family portfolio sharing
- Read-only adviser access in a later release

### Multiple portfolios

- Create, update, archive, and restore portfolios
- Initially support PKR only
- Store name, description, opening date, and status
- Keep ownership boundaries explicit from the first release
- Support personal, dividend, children, experimental, and other user-defined portfolios

### Portfolio accounting

- Buy and sell transactions
- Cash deposits and withdrawals
- Cash dividends
- Bonus shares, rights shares, and stock splits
- Brokerage, commission, taxes, and other charges
- Other auditable adjustments
- Weighted-average cost for holdings display
- Lot-level transaction preservation for FIFO and auditability
- Cash ledger and available-cash calculation
- Realized and unrealized gains
- Settlement date, broker reference, and user notes
- Never silently rewrite financial history

### Automated portfolio synchronization

- Manual transaction entry
- CSV and Excel import
- Broker statement import
- Screenshot and PDF import
- AI-assisted statement extraction
- Email-based broker synchronization
- Duplicate detection and idempotent processing
- Import preview and user correction before confirmation
- Original document retention where permitted
- Import audit history and failure-review queue
- Automatic dividend and corporate-action processing

### Holdings

- Symbol and company name
- Quantity and average cost
- Total invested cost
- Current market price and value
- Realized and unrealized gain/loss
- Daily change
- Portfolio weight and sector
- Dividends received and yield on cost
- Concentration warnings

### Dividends

- Manual and automatic recording
- Gross dividend, tax deducted, and net dividend
- Dividend per share and eligible shares
- Entitlement and payment dates
- Company and portfolio association
- Monthly and annual dividend income
- Yield on cost and dividend history

### PSX company and market data

- Central PSX security master
- Symbol, company name, sector, and security type
- Listing and Shariah-compliance status
- Valuation engine classification: `NORMAL`, `BANK`, or `REIT`
- Current price and price-update timestamp
- Market indices, gainers, losers, and sector performance
- Historical prices
- Financial statements
- Company announcements and PSX news
- Source, freshness, and data-quality metadata for automated fields
- Clear separation between global market data and user portfolio data

### Portfolio dashboard

- Total portfolio value and invested cost
- Available cash
- Daily gain/loss
- Realized and unrealized gain/loss
- Dividend income and total return
- Number of holdings
- Company and sector allocation
- Largest holdings
- Best and worst performers
- Portfolio milestone tracking

### Performance analytics

- Realized, unrealized, dividend, and total returns
- Return by company and portfolio
- Total shareholder return
- Monthly and annual portfolio history
- Company and sector concentration
- KSE-100 and KMI-30 comparison when reliable historical data is available
- Advanced analytics in later commercial plans

### Watchlists and alerts

- Multiple watchlists
- Add and remove companies
- Current price and daily change
- Personal target buy price and notes
- Price, volume, dividend, valuation, and portfolio milestone alerts
- Mobile push notifications

### Tax and Zakat

- FIFO cost-basis calculation
- Pakistan capital-gains and tax-year reports
- Brokerage, commission, CVT, WHT, and dividend-tax tracking
- Zakatable value calculation
- Purification calculation
- Exportable reports
- Version tax and Zakat rules by effective date
- Do not claim automated tax filing or guaranteed legal accuracy

### Valuation and research

- Normal-company valuation engine
- Bank and investment-company valuation engine
- REIT valuation engine
- Preferred buy and accumulate prices
- Fair-value range and margin of safety
- Growth, risk, confidence, and recommendation
- One-off earnings detection
- Manual assumptions and overrides
- Source and freshness information
- Valuation history
- Stock screener and company comparison
- Detailed financial statements
- Portfolio-level valuation view
- Dividends remain visible but do not directly make a company appear cheaper
- Negative-growth businesses must not receive an unqualified automatic `BUY` or `ACCUMULATE`

### Investor utilities

- Investment journal
- Buy and sell notes
- Original investment thesis and thesis reviews
- Portfolio goals
- Target allocation
- Rebalancing suggestions
- CSV and Excel export
- Cloud backup

### Commercial capabilities

- Free and paid plans
- Feature and usage limits
- Subscription management
- Advanced reports and analytics
- Production monitoring, backups, and support workflows

## Explicit exclusions for the initial product

- Actual stock-order placement
- Broker-password storage
- Automated trading
- Broker private-terminal reverse engineering
- Intraday technical-analysis platform
- Cryptocurrency, forex, and international stocks
- Mutual funds in the initial scope
- Social network or investor community
- Guaranteed or autonomous AI investment advice
- Fully automated tax submission
- Tick-by-tick market feeds without the appropriate data rights

## Product principles

- Portfolio accounting correctness takes priority over feature speed.
- Financial history is an auditable ledger.
- Use decimal-safe calculations for money and quantities.
- Global market data, user data, and user overrides are separate concerns.
- Automated imports must be previewable, correctable, idempotent, and traceable.
- Every automated financial field retains its source and freshness.
- Financial, tax, Zakat, and valuation rules are versioned where results can change over time.
- The application explains evidence and uncertainty instead of promising investment outcomes.
- Market-data functionality must respect licensing and usage restrictions.

## Success criteria

PSX Compass reaches its intended product boundary when an investor can:

1. Create and synchronize multiple portfolios.
2. Enter or automatically import complete transaction history.
3. See trustworthy holdings, cash, gains, dividends, taxes, and total returns.
4. Track PSX market and company information.
5. Calculate FIFO CGT and supported Zakat values.
6. Receive relevant alerts and reports.
7. Research and value normal companies, banks, investment companies, and REITs.
8. Understand how valuation, concentration, and performance affect the complete portfolio.
