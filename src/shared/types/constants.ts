/**
 * Shared constants for validation and type definitions
 */

/**
 * UUID v4 validation regex
 */
export const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Month format validation regex (YYYY-MM)
 */
export const MONTH_FORMAT_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;