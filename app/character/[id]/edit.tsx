import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { CharacterForm } from "../../home/components/CharacterForm";
import { getCharacter, updateCharacter } from "../../api/characters";
import type { CharacterInput } from "../../Types/Character";

export default function EditCharacterScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
    const characterId = useMemo(() => Number(idParam), [idParam]);

    const [initial, setInitial] = useState<CharacterInput | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!idParam || Number.isNaN(characterId)) {
            setError("Keine gueltige Charakter-ID gefunden.");
            return;
        }

        getCharacter(characterId)
            .then((data) => {
                setInitial({
                    name: data.name,
                    species: data.species,
                    status: data.status,
                    gender: data.gender,
                    image: data.image,
                    originName: data.origin?.name || "",
                });
                setError(null);
            })
            .catch(() => {
                setError("Character konnte nicht geladen werden.");
            });
    }, [characterId, idParam]);

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <Stack.Screen options={{ title: "Edit Character" }} />
            {error ? (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-sm text-red-500">{error}</Text>
                </View>
            ) : !initial ? (
                <Text className="text-gray-500">Loading...</Text>
            ) : (
                <CharacterForm
                    initial={initial}
                    submitLabel="Save"
                    onSubmit={async (values) => {
                        if (!idParam || Number.isNaN(characterId)) return;
                        await updateCharacter(characterId, values);
                        router.replace(`/character/${idParam}`);
                    }}
                />
            )}
        </SafeAreaView>
    );
}
