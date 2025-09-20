/**
 * Liability types and validation schemas
 * 
 * This file contains the Liability document type, LiabilityEntry, enums, and validation schemas.
 */

import { z } from 'zod';
import { isValidISODateTime } from '../utils';
import { BaseDocument, DocumentKind, createBaseDocumentSchema } from './base-document';
import { UUID_V4_REGEX } from './constants';

/**
 * Liability type enumeration
 */
export enum LiabilityType {
    CreditCard = "Credit Card",
    CarLoan = "Car Loan",
    StudentLoan = "Student Loan",
    MedicalBills = "Medical Bills",
    PersonalLoan = "Personal Loan",
    Mortgage = "Mortgage",
    OtherLiability = "Other Liability",
}

/**
 * Liability specification interface
 */
export interface LiabilitySpec {
    id: string; // UUID v4
    name: string;
    type: LiabilityType;
    isArchived: boolean;
    createdAt: string;
}

/**
 * Liability document type
 */
export interface Liability extends BaseDocument<LiabilitySpec> {
    kind: DocumentKind.Liability;
}

/**
 * Liability specification schema
 */
export const LiabilitySpecSchema = z.object({
    id: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    name: z.string().min(1, "Liability name is required"),
    type: z.enum([
        LiabilityType.CreditCard,
        LiabilityType.CarLoan,
        LiabilityType.StudentLoan,
        LiabilityType.MedicalBills,
        LiabilityType.PersonalLoan,
        LiabilityType.Mortgage,
        LiabilityType.OtherLiability,
    ]),
    isArchived: z.boolean(),
    createdAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
});

/**
 * Liability document schema
 */
export const LiabilitySchema = createBaseDocumentSchema(LiabilitySpecSchema).refine(
    (data) => data.kind === DocumentKind.Liability,
    { message: "Document kind must be Liability" }
);

/**
 * Liability entry specification interface
 */
export interface LiabilityEntrySpec {
    id: string; // UUID v4
    liabilityId: string; // Reference to Liability.id (UUID v4)
    value: number;
}

/**
 * Liability entry document type
 */
export interface LiabilityEntry extends BaseDocument<LiabilityEntrySpec> {
    kind: DocumentKind.Entry;
}

/**
 * Liability entry specification schema
 */
export const LiabilityEntrySpecSchema = z.object({
    id: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    liabilityId: z.string().regex(UUID_V4_REGEX, "Invalid UUID v4 format"),
    value: z.number().refine((val) => Number.isFinite(val), { message: "Value must be a finite number" }),
});

/**
 * Liability entry document schema
 */
export const LiabilityEntrySchema = createBaseDocumentSchema(LiabilityEntrySpecSchema).refine(
    (data) => data.kind === DocumentKind.Entry,
    { message: "Document kind must be Entry" }
);