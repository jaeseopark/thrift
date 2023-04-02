import Fraction from "fraction.js";

import { AbstractMaterial, Measurement, Unit } from "./schema";

export const getRandomValue = (len: number = 36) => {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (dec) => dec.toString(16).padStart(2, "0")).join("");
};

export const getNewProjectName = (existingProjectNames: string[]): string => {
  const NEW_PROJECT = "New Project";
  if (!existingProjectNames.includes(NEW_PROJECT)) {
    return NEW_PROJECT;
  }

  // TOOD: replace with regex (find the highest integer, then +1)
  for (let i = 2; i < 1000; i++) {
    const newName = `${NEW_PROJECT} ${i}`;
    if (!existingProjectNames.includes(newName)) {
      return newName;
    }
  }

  return NEW_PROJECT;
};

export const range = (start: number, end: number) => {
  const min = Math.min(start, end);
  const max = Math.max(start, end);
  const arr = [];
  for (let i = min; i <= max; i++) {
    arr.push(i);
  }
  return arr;
};

export const getDefaultMaterialCatalog = (): AbstractMaterial[] => {
  const catalog: AbstractMaterial[] = [];

  ["MDF", "Melamine"].forEach((sheetType) =>
    catalog.push({
      id: getRandomValue(),
      name: sheetType,
      type: "SHEET",
      hasGrainDirection: false,
    })
  );

  ["Birch", "Baltic Birch", "Walnut"].forEach((plywoodType) => {
    catalog.push({
      id: getRandomValue(),
      name: `[Plywood] ${plywoodType}`,
      type: "SHEET",
      hasGrainDirection: true,
    });
  });

  [
    "Ash",
    "Cherry",
    "Maple",
    "Walnut",
    "Walnut - Black",
    "Oak - Red",
    "Oak - White",
    "Poplar",
  ].forEach((woodtype) => {
    catalog.push({
      id: getRandomValue(),
      name: `[Solid] ${woodtype}`,
      type: "SOLID_WOOD",
      hasGrainDirection: true,
    });
  });

  catalog.sort((a, b) => a.name.localeCompare(b.name));

  return catalog;
};

export const toHumanFormat = (length: Measurement): string => {
  switch (length.unit) {
    case "mm":
      return length.value.toFixed(0) + " mm";
    case "inch":
      return new Fraction(length.value).toFraction(true) + '"';
    default:
      throw new Error("Unsupported type: " + length.unit);
  }
};

export const getOccurrences = (text: string, substring: string): number => {
  const match = text.match(new RegExp(substring));
  if (match) {
    return match.length;
  }
  return 0;
};

const CONVERSION_RATES: { [key: string]: number } = {
  "inch->mm": 25.4,
  "mm->inch": 1 / 25.4,
};
export const convert = (measurement: Measurement, targetUnit: Unit): Measurement => {
  return {
    value: measurement.value * CONVERSION_RATES[`${measurement.unit}->${targetUnit}`],
    unit: targetUnit,
  };
};

const MEASUREMENT_REGEX = /^([0-9 \/]+)("|mm)?$/;
const MEASUREMENT_SANITIZE_REGEX = /^(([0-9]+)|([0-9]+\/+[0-9]+)|(([0-9]+) ([0-9]+\/+[0-9]+)))$/;
export const toMeasurement = (
  humanFormat: string,
  preferredUnit: Unit
): Measurement | undefined => {
  const match = humanFormat.trim().match(MEASUREMENT_REGEX);
  if (match) {
    let value = match[1].trim();
    let unit = preferredUnit.toString();

    if (match.length > 2 && match[2]) {
      unit = match[2].trim().replace('"', "inch");
    }

    if (value.match(MEASUREMENT_SANITIZE_REGEX)) {
      if (value.includes(" ")) {
        const [whole, remainder] = value.split(" ");
        value = remainder;
        return {
          value: Number.parseInt(whole) + new Fraction(remainder).valueOf(),
          unit: unit as Unit,
        };
      }

      return {
        value: new Fraction(value).valueOf(),
        unit: unit as Unit,
      };
    }
  }
};

const ERROR_MARGIN_BY_UNIT: { [unit: string]: number } = {
  inch: 1 / 32,
  mm: 1,
};
export const equals = (m1: Measurement, m2: Measurement): boolean => {
  if (m1.unit !== m2.unit) {
    const m1alt = convert(m1, m2.unit);
    return equals(m1alt, m2);
  }
  return m1.unit == m2.unit && Math.abs(m1.value - m2.value) < ERROR_MARGIN_BY_UNIT[m1.unit];
};
