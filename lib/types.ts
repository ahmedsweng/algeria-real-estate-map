// Map related types
export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
  padding?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Property related types
export interface Agent {
  name: string;
  phone: string;
  avatar?: string;
  email?: string;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  type: "Apartment" | "House" | "Villa" | "Land" | string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  description: string;
  features: string[];
  images: string[];
  longitude: number;
  latitude: number;
  agent: Agent;
  furnished?: boolean;
  yearBuilt?: number;
  status?: "For Sale" | "For Rent" | "Sold" | "Rented";
}

// Points of Interest types
export type POIType =
  | "school"
  | "hospital"
  | "shopping"
  | "restaurant"
  | string;

export interface POI {
  id: number;
  name: string;
  type: POIType;
  longitude: number;
  latitude: number;
  description?: string;
  address?: string;
  rating?: number;
  openingHours?: string;
  contact?: string;
  website?: string;
  image?: string;
}

// Filter related types
export interface FilterValues {
  priceRange: [number, number];
  bedrooms: string;
  propertyType: string;
  furnished: boolean;
  minArea?: number;
  maxArea?: number;
  features?: string[];
}

// Measurement related types
export type MeasurePoint = [number, number]; // [longitude, latitude]

export interface MeasurementLineGeoJSON {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: {
      type: "LineString";
      coordinates: MeasurePoint[];
    };
    properties: Record<string, any>;
  }[];
}

// Form related types
export interface PropertyFormValues {
  title: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  description: string;
  features: string[];
  furnished: boolean;
  images?: FileList;
}

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "agent" | "admin";
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues extends LoginFormValues {
  name: string;
  confirmPassword: string;
}

// Map event types
export interface MapClickEvent {
  lngLat: {
    lng: number;
    lat: number;
  };
  features?: any[];
  originalEvent: MouseEvent;
}

export interface MapContextMenuEvent extends MapClickEvent {
  preventDefault: () => void;
}

// Search related types
export interface SearchResult {
  id: string;
  type: "property" | "location" | "area";
  title: string;
  subtitle?: string;
  longitude: number;
  latitude: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: Date;
}

// Algeria bounds
export const ALGERIA_BOUNDS = {
  west: -8.68, // Western boundary
  south: 19.06, // Southern boundary
  east: 12.0, // Eastern boundary
  north: 37.09, // Northern boundary
  maxZoom: 16,
  minZoom: 5,
};

// Map styles
export interface MapStyleOption {
  id: string;
  name: string;
  url: string;
  icon: string;
  darkMode: boolean;
}

export const MAP_STYLES: MapStyleOption[] = [
  {
    id: "streets",
    name: "Streets",
    url: "mapbox://styles/mapbox/streets-v11",
    icon: "🗺️",
    darkMode: false,
  },
  {
    id: "satellite",
    name: "Satellite",
    url: "mapbox://styles/mapbox/satellite-v9",
    icon: "🛰️",
    darkMode: true,
  },
  {
    id: "satellite-streets",
    name: "Satellite Streets",
    url: "mapbox://styles/mapbox/satellite-streets-v11",
    icon: "🌍",
    darkMode: true,
  },
  {
    id: "light",
    name: "Light",
    url: "mapbox://styles/mapbox/light-v10",
    icon: "⚪",
    darkMode: false,
  },
  {
    id: "dark",
    name: "Dark",
    url: "mapbox://styles/mapbox/dark-v10",
    icon: "⚫",
    darkMode: true,
  },
  {
    id: "outdoors",
    name: "Outdoors",
    url: "mapbox://styles/mapbox/outdoors-v11",
    icon: "🏞️",
    darkMode: false,
  },
];
