/**
 * Unit tests for base document types
 */

import {
    ApiVersion,
    BaseDocumentClass,
    DocumentKind,
} from '../../../../src/shared/types/base-document';

describe('Base Document Types', () => {
    describe('Enums', () => {
        test('ApiVersion should have correct values', () => {
            expect(ApiVersion.V1).toBe('momentum.app/v1');
        });

        test('DocumentKind should have correct values', () => {
            expect(DocumentKind.Portfolio).toBe('Portfolio');
            expect(DocumentKind.MonthlySnapshot).toBe('MonthlySnapshot');
            expect(DocumentKind.Asset).toBe('Asset');
            expect(DocumentKind.Liability).toBe('Liability');
            expect(DocumentKind.Entry).toBe('Entry');
        });
    });

    describe('BaseDocumentClass', () => {
        class TestDocument extends BaseDocumentClass<{ testField: string }> {
            apiVersion = ApiVersion.V1;
            kind = DocumentKind.Portfolio;
            metadata = {
                name: 'test',
                createdAt: '2024-01-01T00:00:00.000Z',
                updatedAt: '2024-01-01T00:00:00.000Z',
                version: 1,
            };
            spec = { testField: 'test' };
        }

        test('should update metadata when updateMetadata is called', () => {
            const doc = new TestDocument();
            const originalUpdatedAt = doc.metadata.updatedAt;
            const originalVersion = doc.metadata.version;

            // Wait a bit to ensure timestamp difference
            setTimeout(() => {
                (doc as any).updateMetadata();

                expect(doc.metadata.updatedAt).not.toBe(originalUpdatedAt);
                expect(doc.metadata.version).toBe(originalVersion + 1);
            }, 10);
        });
    });
});