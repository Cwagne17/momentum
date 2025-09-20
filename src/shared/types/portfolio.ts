/**
 * Portfolio types and validation schemas
 * 
 * This file contains the Portfolio document type and its validation schema.
 */

import { z } from 'zod';
import { isValidISODateTime } from '../utils';
import { BaseDocument, DocumentKind, createBaseDocumentSchema } from './base-document';

/**
 * Portfolio specification interface
 */
export interface PortfolioSpec {
    name: string;
    folderPath: string;
    currency: "USD";
    createdAt: string;
    lastModified: string;
}

/**
 * Portfolio document type
 */
export interface Portfolio extends BaseDocument<PortfolioSpec> {
    kind: DocumentKind.Portfolio;
}

/**
 * Portfolio specification schema
 */
export const PortfolioSpecSchema = z.object({
    name: z.string().min(1, "Portfolio name is required"),
    folderPath: z.string().min(1, "Folder path is required"),
    currency: z.literal("USD"),
    createdAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
    lastModified: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
});

/**
 * Portfolio document schema
 */
export const PortfolioSchema = createBaseDocumentSchema(PortfolioSpecSchema).refine(
    (data) => data.kind === DocumentKind.Portfolio,
    { message: "Document kind must be Portfolio" }
);