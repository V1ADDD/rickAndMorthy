export interface Character {
    id: number;
    name: string;
    status: CharacterStatus;
    species: string;
    type: string;
    gender: "Male" | "Female" | "Genderless" | "unknown";
    origin: {
        name: string;
        url: string;
    };
    location: {
        name: string;
        url: string;
    };
    image: string;
    episode: string[];
    url: string;
    created: string;
}

export type CharacterStatus =  "Alive" | "Dead" | "unknown" | "";

export interface ResponseCharacters {
    info: {
        count: number,
        pages: number,
        next: string,
        prev: string
    },
    results: Character[]
}
