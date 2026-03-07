import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams } from "expo-router";

type CharacterDetails = {
    id: number;
    name: string;
    image: string;
    species: string;
    status: string;
    gender: string;
    origin?: {
        name: string;
    };
};

function normalizeId(value?: string | string[]) {
    return Array.isArray(value) ? value[0] : value;
}

export default function CharacterDetailsScreen() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const characterId = normalizeId(params.id);
    const [character, setCharacter] = useState<CharacterDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadCharacter() {
            if (!characterId) {
                setError("Keine Charakter-ID gefunden.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `http://localhost:8080/api/characters/${encodeURIComponent(characterId)}`,
                );

                if (!response.ok) {
                    throw new Error("Request failed");
                }

                const data = (await response.json()) as CharacterDetails;

                if (!cancelled) {
                    setCharacter(data);
                }
            } catch {
                if (!cancelled) {
                    setCharacter(null);
                    setError("Charakter konnte nicht geladen werden.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadCharacter();

        return () => {
            cancelled = true;
        };
    }, [characterId]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Stack.Screen options={{ title: character?.name ?? "Character" }} />
            <View className="flex-1 px-6 py-4">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="small" color="#111827" />
                        <Text className="mt-3 text-sm text-gray-600">Lade Charakter...</Text>
                    </View>
                ) : null}

                {!loading && error ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-center text-sm text-red-500">{error}</Text>
                    </View>
                ) : null}

                {!loading && !error && character ? (
                    <View className="gap-6">
                        <Image
                            source={{ uri: character.image }}
                            className="h-72 w-full rounded-3xl bg-gray-100"
                            resizeMode="cover"
                        />
                        <View className="gap-3 rounded-3xl border border-gray-200 bg-gray-50 p-5">
                            <Text className="text-3xl font-bold text-gray-900">
                                {character.name}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Spezies: {character.species}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Status: {character.status}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Geschlecht: {character.gender}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Herkunft: {character.origin?.name ?? "Unbekannt"}
                            </Text>
                        </View>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
}
