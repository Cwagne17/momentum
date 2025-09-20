/**
 * Date handling utilities
 * 
 * This module provides functions for date manipulation, formatting,
 * and validation used throughout the application.
 */

/**
 * Formats a date to YYYY-MM format for monthly snapshots
 * @param date - The date to format
 * @returns A string in YYYY-MM format
 */
export function formatToMonthString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
}

/**
 * Parses a YYYY-MM string to a Date object (first day of the month)
 * @param monthString - The month string in YYYY-MM format
 * @returns A Date object representing the first day of the month
 * @throws Error if the month string is invalid
 */
export function parseMonthString(monthString: string): Date {
    const monthRegex = /^(\d{4})-(0[1-9]|1[0-2])$/;
    const match = monthString.match(monthRegex);

    if (!match) {
        throw new Error(`Invalid month format: ${monthString}. Expected YYYY-MM format.`);
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JavaScript months are 0-indexed

    return new Date(year, month, 1);
}

/**
 * Gets the current month string in YYYY-MM format
 * @returns Current month in YYYY-MM format
 */
export function getCurrentMonthString(): string {
    return formatToMonthString(new Date());
}

/**
 * Gets the previous month string in YYYY-MM format
 * @param monthString - Optional base month string, defaults to current month
 * @returns Previous month in YYYY-MM format
 */
export function getPreviousMonthString(monthString?: string): string {
    const baseDate = monthString ? parseMonthString(monthString) : new Date();
    const previousMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, 1);
    return formatToMonthString(previousMonth);
}

/**
 * Gets the next month string in YYYY-MM format
 * @param monthString - Optional base month string, defaults to current month
 * @returns Next month in YYYY-MM format
 */
export function getNextMonthString(monthString?: string): string {
    const baseDate = monthString ? parseMonthString(monthString) : new Date();
    const nextMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
    return formatToMonthString(nextMonth);
}

/**
 * Validates if a string is in YYYY-MM format
 * @param monthString - The string to validate
 * @returns True if the string is in valid YYYY-MM format
 */
export function isValidMonthString(monthString: string): boolean {
    const monthRegex = /^(\d{4})-(0[1-9]|1[0-2])$/;
    return monthRegex.test(monthString);
}

/**
 * Gets an ISO datetime string for the current moment
 * @returns ISO datetime string
 */
export function getCurrentISOString(): string {
    return new Date().toISOString();
}

/**
 * Validates if a string is a valid ISO datetime
 * @param dateString - The string to validate
 * @returns True if the string is a valid ISO datetime
 */
export function isValidISODateTime(dateString: string): boolean {
    try {
        const date = new Date(dateString);
        return date.toISOString() === dateString;
    } catch {
        return false;
    }
}

/**
 * Calculates the difference in months between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The number of months between the dates
 */
export function getMonthsDifference(startDate: Date, endDate: Date): number {
    const yearDiff = endDate.getFullYear() - startDate.getFullYear();
    const monthDiff = endDate.getMonth() - startDate.getMonth();
    return yearDiff * 12 + monthDiff;
}

/**
 * Gets a list of month strings between two dates (inclusive)
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Array of month strings in YYYY-MM format
 */
export function getMonthStringsBetween(startDate: Date, endDate: Date): string[] {
    const months: string[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
        months.push(formatToMonthString(current));
        current.setMonth(current.getMonth() + 1);
    }

    return months;
}

/**
 * Checks if a date is in the same month as another date
 * @param date1 - First date
 * @param date2 - Second date
 * @returns True if both dates are in the same month and year
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth();
}

