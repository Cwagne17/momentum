/**
 * Monthly snapshot types and validation schemas
 * 
 * This file contains the MonthlySnapshot document type and validation schema.
 */

import { z } from 'zod';
import { isValidISODateTime } from '../utils';
import { AssetEntrySpec, AssetEntrySpecSchema } from './asset';
import { BaseDocument, DocumentKind, createBaseDocumentSchema } from './base-document';
import { MONTH_FORMAT_REGEX } from './constants';
import { LiabilityEntrySpec, LiabilityEntrySpecSchema } from './liability';

/**
 * Monthly snapshot specification interface
 */
export interface MonthlySnapshotSpec {
    month: string; // YYYY-MM format
    assetEntries: AssetEntrySpec[];
    liabilityEntries: LiabilityEntrySpec[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Monthly snapshot document type
 */
export interface MonthlySnapshot extends BaseDocument<MonthlySnapshotSpec> {
    kind: DocumentKind.MonthlySnapshot;
}

/**
 * Monthly snapshot specification schema
 */
export const MonthlySnapshotSpecSchema = z.object({
    month: z.string().regex(MONTH_FORMAT_REGEX, "Month must be in YYYY-MM format"),
    assetEntries: z.array(AssetEntrySpecSchema),
    liabilityEntries: z.array(LiabilityEntrySpecSchema),
    createdAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
    updatedAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
});

/**
 * Monthly snapshot document schema
 */
export const MonthlySnapshotSchema = createBaseDocumentSchema(MonthlySnapshotSpecSchema).refine(
    (data) => data.kind === DocumentKind.MonthlySnapshot,
    { message: "Document kind must be MonthlySnapshot" }
);