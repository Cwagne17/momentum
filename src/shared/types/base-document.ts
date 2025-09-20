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
    Liability = "Liability",
    Entry = "Entry",
}

/**
 * Base document interface following Kubernetes-style schema
 * @template T - The type of the spec property
 */
export interface BaseDocument<T = any> {
    apiVersion: ApiVersion;
    kind: DocumentKind;
    metadata: {
        name: string;
        createdAt: string;
        updatedAt: string;
        version: number;
    };
    spec: T;
}

/**
 * Abstract base class for all document types
 * @template T - The type of the spec property
 */
export abstract class BaseDocumentClass<T> implements BaseDocument<T> {
    abstract apiVersion: ApiVersion;
    abstract kind: DocumentKind;
    abstract metadata: BaseDocument<T>["metadata"];
    abstract spec: T;

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
 * @template T - The spec schema type
 */
export const createBaseDocumentSchema = <T extends z.ZodTypeAny>(specSchema: T) =>
    z.object({
        apiVersion: z.enum([ApiVersion.V1]),
        kind: z.enum([
            DocumentKind.Portfolio,
            DocumentKind.MonthlySnapshot,
            DocumentKind.Asset,
            DocumentKind.Liability,
            DocumentKind.Entry,
        ]),
        metadata: MetadataSchema,
        spec: specSchema,
    });