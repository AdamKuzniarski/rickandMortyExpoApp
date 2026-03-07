import { ActivityIndicator, Text, View } from "react-native";
import type { ListStateProps } from "../types";

export function ListState({ loading, error, hasItems, query }: ListStateProps) {
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
        const message = query ? `Keine Treffer fuer "${query}".` : "Keine Charaktere gefunden.";

        return <Text className="py-10 text-center text-sm text-gray-500">{message}</Text>;
    }

    return null;
}

