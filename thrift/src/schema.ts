export const SCHEMA_VERSION = "1";

export type Unit = "inch" | "foot" | "mm" | "cm" | "m";

export type ImperialPrecision = 4 | 8 | 16;

export type Measurement = {
  unit: Unit;
  value: number;
};

export type AbstractMaterial = { id: string; name: string; hasGrainDirection: boolean } & {
  type: "SHEET" | "SOLID_WOOD";
};

export type PhysicalMaterial = {
  id: string;
  abstractMaterialId: string;
  thickness: Measurement;
  width: Measurement;
  length: Measurement;
  quantity: number;
};

export type MaterialRequirement = PhysicalMaterial & { shouldMaintainGrainDirection: boolean };

export type ProjectHeaderProps = {
  id: string;
  name: string;
  description: string;
  imageUrls: string; // line-separated image URLs
};

export type Project = ProjectHeaderProps & { requirements: MaterialRequirement[] };

export type State = {
  projects: Project[];
  catalog: AbstractMaterial[];
  inventory: PhysicalMaterial[];
  preferredUnit: Unit;
  imperialPrecision: ImperialPrecision;
};
