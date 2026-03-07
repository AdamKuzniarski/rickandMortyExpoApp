import {Character, CharacterInput} from "../Types/Character";
import {id} from "postcss-selector-parser";

const BASE = "http://192.168.176.150:8080/api/characters";

export async function listCharacters(query: string): Promise<Character[]> {
    const q = query.trim()
    const url = q ? `${BASE}?name=${encodeURIComponent(q)}` : BASE;

    const res = await fetch(url);
    if(!res.ok) return [];

    const data = await res.json();
    return data.results ?? [];
}

export async function getCharacter(id: number): Promise<Character> {
    const res = await fetch(`${BASE}/${id}`);
    if(!res.ok) throw new Error("GET failed");

    return await res.json();
}

export async function createCharacter(input: CharacterInput): Promise<Character> {
    const res = await fetch(`${BASE}/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input),
    })
    if(!res.ok) throw new Error("POST failed");

    return await res.json();
}

export async function updateCharacter(id: number, input: CharacterInput):Promise<Character>{
    const res = await fetch(`${BASE}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(input),
    })


    if(!res.ok) throw new Error("PUT failed");
    return await res.json();
}

export async function deleteCharacter(id: number): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {
        method: "DELETE",
    })

    if(!res.ok) throw new Error("DELETE failed");
}