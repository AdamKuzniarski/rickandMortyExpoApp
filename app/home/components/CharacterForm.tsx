import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import type { CharacterInput } from "../../Types/Character";

type Props = {
    initial?: CharacterInput;
    submitLabel: string;
    onSubmit: (input: CharacterInput) => Promise<void> | void;
};

export function CharacterForm({ initial, submitLabel, onSubmit }: Props) {
    const [name, setName] = useState(initial?.name ?? "");
    const [species, setSpecies] = useState(initial?.species ?? "");
    const [status, setStatus] = useState(initial?.status ?? "");
    const [gender, setGender] = useState(initial?.gender ?? "");
    const [image, setImage] = useState(initial?.image ?? "");
    const [originName, setOriginName] = useState(initial?.originName ?? "");
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (saving) return;

        setSaving(true);
        setSubmitError(null);

        try {
            await onSubmit({
                name: name.trim(),
                species: species.trim(),
                status: status.trim() || undefined,
                gender: gender.trim() || undefined,
                image: image.trim() || undefined,
                originName: originName.trim() || undefined,
            });
        } catch {
            setSubmitError("Speichern fehlgeschlagen.");
        } finally {
            setSaving(false);
        }
    };

    const disabled = saving || !name.trim() || !species.trim();

    return (
        <View className="gap-3">
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Name*"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Species*"
                value={species}
                onChangeText={setSpecies}
            />
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Status"
                value={status}
                onChangeText={setStatus}
            />
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Gender"
                value={gender}
                onChangeText={setGender}
            />
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Image URL"
                value={image}
                onChangeText={setImage}
            />
            <TextInput
                className="rounded-xl border border-gray-300 px-4 py-3"
                placeholder="Origin Name"
                value={originName}
                onChangeText={setOriginName}
            />

            {submitError ? <Text className="text-sm text-red-500">{submitError}</Text> : null}

            <Pressable
                className={`rounded-xl px-4 py-3 ${disabled ? "bg-gray-300" : "bg-blue-500"}`}
                onPress={handleSubmit}
                disabled={disabled}
            >
                <Text className="text-white text-center font-bold">{submitLabel}</Text>
                <Text className="text-xs text-gray-500">* Pflichtfelder</Text>
            </Pressable>
        </View>
    );
}
