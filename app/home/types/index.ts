import type { Character } from "../../Types/Character";

export type HomeSearchParams = {
    q?: string | string[];
};

export type CharacterListItemProps = {
    item: Character;
    onPress: (id: number | string) => void;
};

export type ListStateProps = {
    loading: boolean;
    error: string | null;
    hasItems: boolean;
    query: string;
};
