import type { Character, CharacterInput } from "../Types/Character";

const BASE = "http://localhost:8080/api/characters";

type CharacterListResponse = {
    results?: Character[];
};

type CharacterWritePayload = {
    name: string;
    status: "Alive" | "Dead" | "unknown";
    species: string;
    type?: string;
    gender: string;
    origin: {
        name: string;
    };
    location: {
        name: string;
    };
    image: string;
};

const DEFAULT_IMAGE = "https://rickandmortyapi.com/api/character/avatar/19.jpeg";

function normalizeStatus(value?: string): "Alive" | "Dead" | "unknown" {
    if (value === "Alive" || value === "Dead" || value === "unknown") {
        return value;
    }
    return "unknown";
}

function toCreatePayload(input: CharacterInput): CharacterWritePayload {
    const origin = input.originName?.trim() || "unknown";

    return {
        name: input.name.trim(),
        status: normalizeStatus(input.status),
        species: input.species.trim(),
        type: "",
        gender: input.gender?.trim() || "unknown",
        origin: { name: origin },
        location: { name: origin },
        image: input.image?.trim() || DEFAULT_IMAGE,
    };
}

function toUpdatePayload(input: CharacterInput): Partial<CharacterWritePayload> {
    const payload: Partial<CharacterWritePayload> = {};
    const normalizedName = input.name.trim();
    const normalizedSpecies = input.species.trim();
    const normalizedOrigin = input.originName?.trim();
    const normalizedImage = input.image?.trim();
    const normalizedGender = input.gender?.trim();

    if (normalizedName) payload.name = normalizedName;
    if (normalizedSpecies) payload.species = normalizedSpecies;
    if (input.status !== undefined) payload.status = normalizeStatus(input.status);
    if (normalizedGender) payload.gender = normalizedGender;
    if (normalizedImage) payload.image = normalizedImage;
    if (normalizedOrigin) {
        payload.origin = { name: normalizedOrigin };
        payload.location = { name: normalizedOrigin };
    }

    return payload;
}

async function readJsonOrThrow<T>(response: Response, message: string): Promise<T> {
    if (!response.ok) {
        throw new Error(message);
    }

    return (await response.json()) as T;
}

export async function listCharacters(query: string): Promise<Character[]> {
    const q = query.trim();
    const url = q ? `${BASE}?name=${encodeURIComponent(q)}` : BASE;
    const response = await fetch(url);
    const data = await readJsonOrThrow<CharacterListResponse>(
        response,
        "Characters konnten nicht geladen werden.",
    );
    return data.results ?? [];
}

export async function getCharacter(id: number): Promise<Character> {
    const response = await fetch(`${BASE}/${id}`);
    return readJsonOrThrow<Character>(response, "Character konnte nicht geladen werden.");
}

export async function createCharacter(input: CharacterInput): Promise<Character> {
    const payload = toCreatePayload(input);
    const response = await fetch(BASE, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return readJsonOrThrow<Character>(response, "Character konnte nicht erstellt werden.");
}

export async function updateCharacter(id: number, input: CharacterInput): Promise<Character> {
    const payload = toUpdatePayload(input);
    const response = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return readJsonOrThrow<Character>(response, "Character konnte nicht gespeichert werden.");
}

export async function deleteCharacter(id: number): Promise<void> {
    const response = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Character konnte nicht geloescht werden.");
    }
}
