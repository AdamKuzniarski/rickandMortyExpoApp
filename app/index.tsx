import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Character } from "./Types/Character";

type CharacterApiResponse = {
    results?: Character[];
};

function normalizeQuery(query?: string | string[]) {
    const value = Array.isArray(query) ? query[0] : query;
    return value?.trim() ?? "";
}

function createCharactersUrl(query: string) {
    const baseUrl = "https://rickandmortyapi.com/api/character";

    if (!query) {
        return baseUrl;
    }

    return `${baseUrl}/?name=${encodeURIComponent(query)}`;
}

function useCharacters(query: string) {
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

type CharacterListItemProps = {
    item: Character;
    onPress: (id: number) => void;
};

function CharacterListItem({ item, onPress }: CharacterListItemProps) {
    return (
        <Pressable
            className="flex-row items-center rounded-2xl border border-gray-200 bg-white p-4"
            onPress={() => onPress(item.id)}
        >
            <Image source={{ uri: item.image }} className="h-16 w-16 rounded-full" />
            <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-sm text-gray-600">{item.species}</Text>
            </View>
        </Pressable>
    );
}

type ListStateProps = {
    loading: boolean;
    error: string | null;
    hasItems: boolean;
    query: string;
};

function ListState({ loading, error, hasItems, query }: ListStateProps) {
    if (loading) {
        return (
            <View className="items-center py-10">
                <ActivityIndicator size="small" color="#111827" />
                <Text className="mt-3 text-sm text-gray-600">Lade Charaktere...</Text>
            </View>
        );
    }

    if (error) {
        return <Text className="py-10 text-center text-sm text-red-500">{error}</Text>;
    }

    if (!hasItems) {
        const message = query
            ? `Keine Treffer fuer "${query}".`
            : "Keine Charaktere gefunden.";

        return (
            <Text className="py-10 text-center text-sm text-gray-500">
                {message}
            </Text>
        );
    }

    return null;
}

export default function Home() {
    const router = useRouter();
    const params = useLocalSearchParams<{ q?: string | string[] }>();
    const query = useMemo(() => normalizeQuery(params.q), [params.q]);
    const [text, setText] = useState(query);
    const { items, loading, error } = useCharacters(query);

    useEffect(() => {
        setText(query);
    }, [query]);

    const handleSearch = useCallback(() => {
        const nextQuery = text.trim();

        if (!nextQuery) {
            router.replace("/");
            return;
        }

        router.replace(`/?q=${encodeURIComponent(nextQuery)}`);
    }, [router, text]);

    const handleCharacterPress = useCallback(
        (id: number) => {
            router.push(`/character/${id}`);
        },
        [router],
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16, gap: 12, flexGrow: items.length ? 0 : 1 }}
                keyboardShouldPersistTaps="handled"
                ListHeaderComponent={
                    <View className="mb-2 gap-2">
                        <Text className="text-3xl font-bold text-gray-900">Characters</Text>
                        <Text className="text-sm text-gray-500">
                            Suche nach Rick and Morty Charakteren.
                        </Text>
                        <TextInput
                            className="mt-2 rounded-xl border border-gray-300 px-4 py-3"
                            placeholder="Suche Charakter..."
                            returnKeyType="search"
                            value={text}
                            onChangeText={setText}
                            onSubmitEditing={handleSearch}
                        />
                    </View>
                }
                renderItem={({ item }) => (
                    <CharacterListItem item={item} onPress={handleCharacterPress} />
                )}
                ItemSeparatorComponent={() => <View className="h-3" />}
                ListEmptyComponent={
                    <ListState
                        loading={loading}
                        error={error}
                        hasItems={items.length > 0}
                        query={query}
                    />
                }
            />
        </SafeAreaView>
    );
}
