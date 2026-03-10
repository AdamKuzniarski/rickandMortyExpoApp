import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { Character } from "../../Types/Character";
import { deleteCharacter, getCharacter } from "../../api/characters";

function normalizeId(value?: string | string[]) {
    return Array.isArray(value) ? value[0] : value;
}

export default function CharacterDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const idParam = normalizeId(params.id);
    const characterId = useMemo(() => Number(idParam), [idParam]);
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadCharacter = useCallback(async () => {
        if (!idParam || Number.isNaN(characterId)) {
            setError("Keine gueltige Charakter-ID gefunden.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getCharacter(characterId);
            setCharacter(data);
        } catch {
            setCharacter(null);
            setError("Charakter konnte nicht geladen werden.");
        } finally {
            setLoading(false);
        }
    }, [characterId, idParam]);

    useEffect(() => {
        loadCharacter();
    }, [loadCharacter]);

    const handleDelete = useCallback(() => {
        if (!idParam || Number.isNaN(characterId) || deleting) {
            return;
        }

        Alert.alert("Character loeschen", "Moechtest du diesen Character wirklich loeschen?", [
            { text: "Abbrechen", style: "cancel" },
            {
                text: "Loeschen",
                style: "destructive",
                onPress: async () => {
                    setDeleting(true);
                    try {
                        await deleteCharacter(characterId);
                        router.replace("/");
                    } catch {
                        Alert.alert("Fehler", "Character konnte nicht geloescht werden.");
                    } finally {
                        setDeleting(false);
                    }
                },
            },
        ]);
    }, [characterId, deleting, idParam, router]);

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
                            <Text className="text-3xl font-bold text-gray-900">{character.name}</Text>
                            <Text className="text-base text-gray-700">Spezies: {character.species}</Text>
                            <Text className="text-base text-gray-700">
                                Status: {character.status ?? "Unbekannt"}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Geschlecht: {character.gender ?? "Unbekannt"}
                            </Text>
                            <Text className="text-base text-gray-700">
                                Herkunft: {character.origin?.name ?? "Unbekannt"}
                            </Text>
                        </View>
                        <View className="flex-row gap-3">
                            <Pressable
                                className="flex-1 items-center rounded-xl bg-black px-4 py-3"
                                onPress={() => router.push(`/character/${character.id}/edit`)}
                            >
                                <Text className="font-semibold text-white">Edit</Text>
                            </Pressable>
                            <Pressable
                                className={`flex-1 items-center rounded-xl px-4 py-3 ${
                                    deleting ? "bg-red-300" : "bg-red-500"
                                }`}
                                onPress={handleDelete}
                                disabled={deleting}
                            >
                                <Text className="font-semibold text-white">
                                    {deleting ? "Loesche..." : "Delete"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : null}
            </View>
        </SafeAreaView>
    );
}

