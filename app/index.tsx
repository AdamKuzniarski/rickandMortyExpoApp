import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CharacterListItem } from "./home/components/CharacterListItem";
import { HomeHeader } from "./home/components/HomeHeader";
import { ListState } from "./home/components/ListState";
import { useCharacters } from "./home/hooks/useCharacters";
import type { HomeSearchParams } from "./home/types";
import { normalizeQuery } from "./home/utils/query";
import type { Character } from "./Types/Character";

export default function Home() {
    const router = useRouter();
    const params = useLocalSearchParams<HomeSearchParams>();
    const query = useMemo(() => normalizeQuery(params.q), [params.q]);
    const [text, setText] = useState(query);
    const { items, loading, error } = useCharacters(query);

    useEffect(() => {
        setText(query);
    }, [query]);

    const handleSearchSubmit = useCallback(() => {
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
                    <HomeHeader
                        text={text}
                        onChangeText={setText}
                        onSubmit={handleSearchSubmit}
                    />
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
