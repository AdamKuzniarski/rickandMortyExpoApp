export type Character = {
    id: number | string;
    name: string;
    image: string;
    species: string;
    status?: string;
    gender?: string;
    origin?: { name: string };
};

export type CharacterInput = {
    name: string;
    species: string;
    status?: string;
    gender?: string;
    image?: string;
    originName?: string;
};
