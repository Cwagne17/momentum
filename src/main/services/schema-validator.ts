/**
 * Schema Validator for validating and migrating data schemas
 * Handles validation of all document types and schema migrations between versions
 */

import { ZodError } from 'zod';
import {
    ApiVersion,
    Asset,
    AssetSchema,
    DocumentKind,
    Liability,
    LiabilitySchema,
    MonthlySnapshot,
    MonthlySnapshotSchema,
    Portfolio,
    PortfolioSchema
} from '../../shared/types';

export class SchemaValidator {
    /**
     * Validates a portfolio document against the schema
     */
    validatePortfolio(data: any): Portfolio {
        try {
            return PortfolioSchema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
                throw new Error(`Portfolio validation failed: ${errorMessages.join(', ')}`);
            }
            throw new Error('Portfolio validation failed: Unknown error');
        }
    }

    /**
     * Validates an asset document against the schema
     */
    validateAsset(data: any): Asset {
        try {
            return AssetSchema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
                throw new Error(`Asset validation failed: ${errorMessages.join(', ')}`);
            }
            throw new Error('Asset validation failed: Unknown error');
        }
    }

    /**
     * Validates a liability document against the schema
     */
    validateLiability(data: any): Liability {
        try {
            return LiabilitySchema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
                throw new Error(`Liability validation failed: ${errorMessages.join(', ')}`);
            }
            throw new Error('Liability validation failed: Unknown error');
        }
    }

    /**
     * Validates a monthly snapshot document against the schema
     */
    validateMonthlySnapshot(data: any): MonthlySnapshot {
        try {
            return MonthlySnapshotSchema.parse(data);
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
                throw new Error(`Monthly snapshot validation failed: ${errorMessages.join(', ')}`);
            }
            throw new Error('Monthly snapshot validation failed: Unknown error');
        }
    }

    /**
     * Validates and migrates a portfolio document to the current schema version
     */
    async validateAndMigratePortfolio(data: any): Promise<Portfolio> {
        // Check if data has the expected structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid portfolio data: Expected object');
        }

        // Check API version and migrate if necessary
        const apiVersion = data.apiVersion;

        if (!apiVersion) {
            throw new Error('Invalid portfolio data: Missing apiVersion');
        }

        // Currently only V1 is supported, but this structure allows for future migrations
        switch (apiVersion) {
            case ApiVersion.V1:
                return this.validatePortfolio(data);

            default:
                throw new Error(`Unsupported API version: ${apiVersion}`);
        }
    }

    /**
     * Validates and migrates an asset document to the current schema version
     */
    async validateAndMigrateAsset(data: any): Promise<Asset> {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid asset data: Expected object');
        }

        const apiVersion = data.apiVersion;

        if (!apiVersion) {
            throw new Error('Invalid asset data: Missing apiVersion');
        }

        switch (apiVersion) {
            case ApiVersion.V1:
                return this.validateAsset(data);

            default:
                throw new Error(`Unsupported API version: ${apiVersion}`);
        }
    }

    /**
     * Validates and migrates a liability document to the current schema version
     */
    async validateAndMigrateLiability(data: any): Promise<Liability> {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid liability data: Expected object');
        }

        const apiVersion = data.apiVersion;

        if (!apiVersion) {
            throw new Error('Invalid liability data: Missing apiVersion');
        }

        switch (apiVersion) {
            case ApiVersion.V1:
                return this.validateLiability(data);

            default:
                throw new Error(`Unsupported API version: ${apiVersion}`);
        }
    }

    /**
     * Validates and migrates a monthly snapshot document to the current schema version
     */
    async validateAndMigrateMonthlySnapshot(data: any): Promise<MonthlySnapshot> {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid monthly snapshot data: Expected object');
        }

        const apiVersion = data.apiVersion;

        if (!apiVersion) {
            throw new Error('Invalid monthly snapshot data: Missing apiVersion');
        }

        switch (apiVersion) {
            case ApiVersion.V1:
                return this.validateMonthlySnapshot(data);

            default:
                throw new Error(`Unsupported API version: ${apiVersion}`);
        }
    }

    /**
     * Validates the document kind matches the expected type
     */
    validateDocumentKind(data: any, expectedKind: DocumentKind): void {
        if (!data.kind) {
            throw new Error('Invalid document: Missing kind');
        }

        if (data.kind !== expectedKind) {
            throw new Error(`Invalid document kind: Expected ${expectedKind}, got ${data.kind}`);
        }
    }

    /**
     * Validates that required metadata fields are present
     */
    validateMetadata(data: any): void {
        if (!data.metadata) {
            throw new Error('Invalid document: Missing metadata');
        }

        const required = ['name', 'createdAt', 'updatedAt', 'version'];
        for (const field of required) {
            if (!data.metadata[field]) {
                throw new Error(`Invalid document: Missing metadata.${field}`);
            }
        }
    }

    /**
     * Checks if a document needs migration based on its API version
     */
    needsMigration(data: any): boolean {
        return data.apiVersion !== ApiVersion.V1;
    }

    /**
     * Gets the current supported API version
     */
    getCurrentApiVersion(): ApiVersion {
        return ApiVersion.V1;
    }
}