/**
 * UUID generation utilities
 * 
 * This module provides functions for generating UUID v4 identifiers
 * used throughout the application for unique entity identification.
 */

import { UUID_V4_REGEX } from '../types/constants';

/**
 * Generates a UUID v4 string
 * @returns A UUID v4 string in the format xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
export function generateUUID(): string {
    // Use crypto.randomUUID if available (Node.js 14.17.0+, modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback implementation for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Validates if a string is a valid UUID v4
 * @param uuid - The string to validate
 * @returns True if the string is a valid UUID v4
 */
export function isValidUUID(uuid: string): boolean {
    return UUID_V4_REGEX.test(uuid);
}

/**
 * Generates a new UUID and validates it
 * @returns A validated UUID v4 string
 * @throws Error if generated UUID is invalid
 */
export function generateValidatedUUID(): string {
    const uuid = generateUUID();
    if (!isValidUUID(uuid)) {
        throw new Error('Generated UUID is invalid');
    }
    return uuid;
}