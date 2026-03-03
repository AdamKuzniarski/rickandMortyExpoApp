import {useEffect, useState} from "react";
import {FlatList, Image, Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLocalSearchParams, useRouter} from "expo-router";
import type {Character} from "./Types/Character";

export default function Home() {
    const router = useRouter();
    const params = useLocalSearchParams<{ q?: string[] }>();
    const q = Array.isArray(params.q) ? params.q[0] : params.q;

    const [text, setText] = useState(q ?? "");
    const [items, setItems] = useState<Character[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setText(q ?? "");
    }, [q]);

    useEffect(() => {
        setLoading(true);
        const url = q?.trim()
            ? `https://rickandmortyapi.com/api/character/?name=${q}`
            : `https://rickandmortyapi.com/api/character`;
        fetch(url).then(res => res.json().then(data => setItems(data)));
    }[q];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4 gap-2">
                </View>
        </SafeAreaView>
)
}