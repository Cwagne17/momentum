/**
 * Asset types and validation schemas
 * 
 * This file contains the Asset document type, AssetEntry, enums, and validation schemas.
 */

import { z } from 'zod';
import { isValidISODateTime } from '../utils';
import { BaseDocument, DocumentKind, createTypedDocumentSchema } from './base-document';
import { UUID_V4_REGEX } from './constants';

/**
 * Asset type enumeration
 */
export enum AssetType {
    Cash = "Cash",
    RetirementInvestment = "Retirement Investment",
    NonRetirementInvestment = "Non-retirement Investment",
    Property = "Property",
    Vehicle = "Vehicle",
    OtherAsset = "Other Asset",
}

/**
 * Asset specification interface
 */
export interface AssetSpec {
    id: string; // UUID v4
    name: string;
    type: AssetType;
    isLiquid: boolean;
    isArchived: boolean;
    createdAt: string;
}

/**
 * Asset document type
 */
export interface Asset extends BaseDocument<AssetSpec> {
    kind: DocumentKind.Asset;
}

/**
 * Asset specification schema
 */
export const AssetSpecSchema = z.object({
    id: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    name: z.string().min(1, "Asset name is required"),
    type: z.enum([
        AssetType.Cash,
        AssetType.RetirementInvestment,
        AssetType.NonRetirementInvestment,
        AssetType.Property,
        AssetType.Vehicle,
        AssetType.OtherAsset,
    ]),
    isLiquid: z.boolean(),
    isArchived: z.boolean(),
    createdAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
});

/**
 * Asset document schema
 */
export const AssetSchema = createTypedDocumentSchema(AssetSpecSchema, DocumentKind.Asset);

/**
 * Asset entry specification interface
 */
export interface AssetEntrySpec {
    id: string; // UUID v4
    assetId: string; // Reference to Asset.id (UUID v4)
    value: number;
}

/**
 * Asset entry document type
 */
export interface AssetEntry extends BaseDocument<AssetEntrySpec> {
    kind: DocumentKind.AssetEntry;
}

/**
 * Asset entry specification schema
 */
export const AssetEntrySpecSchema = z.object({
    id: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    assetId: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    value: z.number().refine((val) => Number.isFinite(val), { message: "Value must be a finite number" }),
});

/**
 * Asset entry document schema
 */
export const AssetEntrySchema = createTypedDocumentSchema(AssetEntrySpecSchema, DocumentKind.AssetEntry);