export const securityTypes = ['EQUITY', 'REIT', 'ETF', 'OTHER'] as const;
export type SecurityType = (typeof securityTypes)[number];

export const listingStatuses = ['ACTIVE', 'SUSPENDED', 'DELISTED'] as const;
export type ListingStatus = (typeof listingStatuses)[number];

export const shariahStatuses = ['COMPLIANT', 'NON_COMPLIANT', 'UNKNOWN'] as const;
export type ShariahStatus = (typeof shariahStatuses)[number];

export const valuationEngines = ['NORMAL', 'BANK', 'REIT'] as const;
export type ValuationEngine = (typeof valuationEngines)[number];

export const indexTypes = ['BROAD_MARKET', 'SECTOR', 'SHARIAH', 'DIVIDEND', 'OTHER'] as const;
export type IndexType = (typeof indexTypes)[number];
