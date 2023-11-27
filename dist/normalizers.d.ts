declare function normalizePath(originalUrl: string, extraMasks?: never[], placeholder?: string): string;
declare function normalizeStatusCode(status: number): "2XX" | "3XX" | "4XX" | "5XX";
export { normalizePath, normalizeStatusCode };
