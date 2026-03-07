export function normalizeQuery(query?: string | string[]) {
    const value = Array.isArray(query) ? query[0] : query;
    return value?.trim() ?? "";
}

export function createCharactersUrl(query: string) {
    const baseUrl = "http://localhost:8080/api/characters";

    if (!query) {
        return baseUrl;
    }

    return `${baseUrl}/?name=${encodeURIComponent(query)}`;
}

