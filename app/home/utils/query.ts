export function normalizeQuery(query?: string | string[]) {
    const value = Array.isArray(query) ? query[0] : query;
    return value?.trim() ?? "";
}
