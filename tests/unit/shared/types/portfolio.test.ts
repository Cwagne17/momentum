/**
 * Unit tests for portfolio types and validation
 */

import { ApiVersion, DocumentKind } from '../../../../src/shared/types/base-document';
import { Portfolio, PortfolioSchema } from '../../../../src/shared/types/portfolio';

describe('Portfolio Types', () => {
    describe('Interface Structure', () => {
        test('Portfolio should have correct structure', () => {
            const portfolio: Portfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: 'Test Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'My Portfolio',
                    folderPath: '/path/to/portfolio',
                    currency: 'USD',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(portfolio.kind).toBe(DocumentKind.Portfolio);
            expect(portfolio.spec.currency).toBe('USD');
        });
    });

    describe('Validation', () => {
        test('should validate correct portfolio', () => {
            const validPortfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Portfolio,
                metadata: {
                    name: 'Test Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'My Portfolio',
                    folderPath: '/path/to/portfolio',
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => PortfolioSchema.parse(validPortfolio)).not.toThrow();
        });

        test('should reject portfolio with wrong kind', () => {
            const invalidPortfolio = {
                apiVersion: ApiVersion.V1,
                kind: DocumentKind.Asset,
                metadata: {
                    name: 'Test Portfolio',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                    version: 1,
                },
                spec: {
                    name: 'My Portfolio',
                    folderPath: '/path/to/portfolio',
                    currency: 'USD' as const,
                    createdAt: '2024-01-01T00:00:00.000Z',
                    lastModified: '2024-01-01T00:00:00.000Z',
                },
            };

            expect(() => PortfolioSchema.parse(invalidPortfolio)).toThrow();
        });
    });
});