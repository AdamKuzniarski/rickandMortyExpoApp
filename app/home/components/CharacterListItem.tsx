import { Image, Pressable, Text, View } from "react-native";
import type { CharacterListItemProps } from "../types";

export function CharacterListItem({ item, onPress }: CharacterListItemProps) {
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

