import type { APIError } from "../lib/ErrorTypes";

export const formattedDate = (date: string) => new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
});

export const retryService = (failureCount: number, error: APIError) => {
    console.log(error);
    if (error?.statusCode === 404) return false;
    return failureCount < 3;
}