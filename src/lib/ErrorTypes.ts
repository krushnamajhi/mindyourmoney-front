export interface APIError {
    success: boolean;
    message: string;
    statusCode: number;
    errors: any[];
}