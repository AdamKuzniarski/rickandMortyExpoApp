import { Text, TextInput, View } from "react-native";

type HomeHeaderProps = {
    text: string;
    onChangeText: (value: string) => void;
    onSubmit: () => void;
};

export function HomeHeader({ text, onChangeText, onSubmit }: HomeHeaderProps) {
    return (
        <View className="mb-2 gap-2">
            <Text className="text-3xl font-bold text-gray-900">Characters</Text>
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

