/**
 * Base document types and schemas for Momentum Net Worth Tracker
 * 
 * This file contains the foundational types and validation schemas that all
 * other document types extend from, following the Kubernetes-style schema pattern.
 */

import { z } from 'zod';
import { isValidISODateTime } from '../utils';

/**
 * API version enum for schema versioning
 */
export enum ApiVersion {
    V1 = "momentum.app/v1",
}

/**
 * Document kind enum for different data types
 */
export enum DocumentKind {
    Portfolio = "Portfolio",
    MonthlySnapshot = "MonthlySnapshot",
    Asset = "Asset",
    AssetEntry = "AssetEntry",
    Liability = "Liability",
    LiabilityEntry = "LiabilityEntry",
}

/**
 * Base document interface following Kubernetes-style schema
 * @template Spec - The type of the spec property
 */
export interface BaseDocument<Spec = any> {
    apiVersion: ApiVersion;
    kind: DocumentKind;
    metadata: {
        name: string;
        createdAt: string;
        updatedAt: string;
        version: number;
    };
    spec: Spec;
}

/**
 * Abstract base class for all document types
 * @template Spec - The type of the spec property
 */
export abstract class BaseDocumentClass<Spec> implements BaseDocument<Spec> {
    abstract apiVersion: ApiVersion;
    abstract kind: DocumentKind;
    abstract metadata: BaseDocument<Spec>["metadata"];
    abstract spec: Spec;

    /**
     * Updates the metadata timestamps and version
     */
    protected updateMetadata(): void {
        const now = new Date().toISOString();
        this.metadata.updatedAt = now;
        this.metadata.version += 1;
    }
}

/**
 * Base metadata schema
 */
export const MetadataSchema = z.object({
    name: z.string().min(1, "Name is required"),
    createdAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
    updatedAt: z.string().refine(isValidISODateTime, { message: "Invalid ISO datetime format" }),
    version: z.number().int().min(1, "Version must be a positive integer"),
});

/**
 * Base document schema factory
 * @template Spec - The spec schema type
 */
export const createBaseDocumentSchema = <Spec extends z.ZodTypeAny>(specSchema: Spec) =>
    z.object({
        apiVersion: z.enum([ApiVersion.V1]),
        kind: z.enum([
            DocumentKind.Portfolio,
            DocumentKind.MonthlySnapshot,
            DocumentKind.Asset,
            DocumentKind.AssetEntry,
            DocumentKind.Liability,
            DocumentKind.LiabilityEntry
        ]),
        metadata: MetadataSchema,
        spec: specSchema,
    });

/**
 * Type-safe document schema factory that enforces a specific document kind
 * @template Spec - The spec schema type
 * @template Kind - The specific document kind
 */
export const createTypedDocumentSchema = <Spec extends z.ZodTypeAny, Kind extends DocumentKind>(
    specSchema: Spec,
    kind: Kind
) =>
    z.object({
        apiVersion: z.literal(ApiVersion.V1),
        kind: z.literal(kind),
        metadata: MetadataSchema,
        spec: specSchema,
    });