import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { CharacterForm } from "../home/components/CharacterForm";
import { createCharacter } from "../api/characters";

export default function CreateCharacterScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            <Stack.Screen options={{ title: "Create Character" }} />
            <CharacterForm
                submitLabel="Create"
                onSubmit={async (values) => {
                    const created = await createCharacter(values);
                    router.replace(`/character/${created.id}`);
                }}
            />
        </SafeAreaView>
    );
}

