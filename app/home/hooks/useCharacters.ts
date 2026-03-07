import { useEffect, useState } from "react";
import type { Character } from "../../Types/Character";
import type { CharacterApiResponse } from "../types";
import { createCharactersUrl } from "../utils/query";

export function useCharacters(query: string) {
    const [items, setItems] = useState<Character[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCharacters() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(createCharactersUrl(query));

                if (!response.ok) {
                    throw new Error("Request failed");
                }

                const data = (await response.json()) as CharacterApiResponse;

                if (!cancelled) {
                    setItems(data.results ?? []);
                }
            } catch {
                if (!cancelled) {
                    setItems([]);
                    setError("Charaktere konnten nicht geladen werden.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCharacters();

        return () => {
            cancelled = true;
        };
    }, [query]);

    return { items, loading, error };
}

