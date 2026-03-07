export type Character = {
    id: number;
    name: string;
    image: string;
    species: string;
    status?: string;
    gender?: string;
    origin?: {name:string};
};

export type CharacterInput ={
    originName: string;
    name: string;
    species: string
    status?: string;
    gender?: string;
    image?: string;
}