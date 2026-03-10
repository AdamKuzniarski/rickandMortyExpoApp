import { Pressable, Text, TextInput, View } from "react-native";

type HomeHeaderProps = {
    text: string;
    onChangeText: (value: string) => void;
    onSubmit: () => void;
    onPressCreate: () => void;
};

export function HomeHeader({ text, onChangeText, onSubmit, onPressCreate }: HomeHeaderProps) {
    return (
        <View className="mb-2 gap-2">
            <View className="flex-row items-center justify-between">
                <Text className="text-3xl font-bold text-gray-900">Characters</Text>
                <Pressable className="rounded-xl bg-black px-3 py-2" onPress={onPressCreate}>
                    <Text className="text-sm font-semibold text-white">New</Text>
                </Pressable>
            </View>
            <Text className="text-sm text-gray-500">Suche nach Rick and Morty Charakteren.</Text>
            <TextInput
                className="mt-2 rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Suche Charakter..."
                returnKeyType="search"
                value={text}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
            />
        </View>
    );
}
