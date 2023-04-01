
export const SCHEMA_VERSION = "1";

export type Length = {
    unit: '"' | "'" | "mm" | "cm" | "m";
    value: number;
};

export type ConfigurableLength = Length & { isImmutable: boolean };

export type ImmutableLength = Length & {
    isImmutable: true;
};

export type Volume = {
    unit: "mL" | "L";
    value: number;
}

export type AbstractMaterial =
    { id: string, name: string } & ({
        type: "SHEET";
        thcikness: ImmutableLength;
        dimensions: ConfigurableLength[];
    }
        | { type: "STOCK"; dimensions: ConfigurableLength[] }
        | { type: "EACH" | "VOLUME" | "MASS" });

export type PhysicalMaterial = {
    material: AbstractMaterial;
    quantity: number;
};

export type ProjectHeaderProps = {
    id: string;
    name: string;
    description: string;
    imageUrls: string; // line-separated image URLs
};

export type Project = ProjectHeaderProps & { requiredMaterials: PhysicalMaterial[] };

export type State = {
    // persisted props
    projects: Project[];
    materials: AbstractMaterial[];

    // ephemeral props
    selectedProjectIndices: number[];
    projectMultiSelectPivotIndex: number;
};
