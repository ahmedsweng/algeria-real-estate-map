import { generatePOIs, generateProperties } from "./generate-data";
import type { POI, Property } from "./types";

// Generate 100 properties across Algeria
export const propertyListings: Property[] = generateProperties(100);

// Generate POIs for each city
export const poiData: POI[] = generatePOIs();
