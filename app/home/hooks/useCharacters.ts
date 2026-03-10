import { useEffect, useState } from "react";
import type { Character } from "../../Types/Character";
import { listCharacters } from "../../api/characters";

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
                const data = await listCharacters(query);

                if (!cancelled) {
                    setItems(data);
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
