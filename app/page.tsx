"use client";

import AddPropertyDialog from "@/components/dialogs/AddPropertyDialog";
import PropertyDetailsPanel from "@/components/dialogs/PropertyDetailsPanel";
import MapView from "@/components/map/Map";
import MapControls from "@/components/map/MapControls";
import TopNavigationBar from "@/components/navigation/TopNavigationBar";
import { propertyListings } from "@/lib/mock-data";
import type {
  FilterValues,
  MapStyleOption,
  MeasurePoint,
  POI,
  Property,
  ViewState,
} from "@/lib/types";
import { MAP_STYLES } from "@/lib/types";
import "mapbox-gl/dist/mapbox-gl.css";
import { useMemo, useRef, useState } from "react";
import { type MapRef } from "react-map-gl/mapbox";

export default function HomePage() {
  const mapRef = useRef<MapRef>(null);

  // Map state
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showPOI, setShowPOI] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<MeasurePoint[]>([]);
  const [measureDistance, setMeasureDistance] = useState<number>(0);
  const [currentMousePosition, setCurrentMousePosition] =
    useState<MeasurePoint | null>(null);

  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    content: string;
  } | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 3.042048, // Algiers coordinates
    latitude: 36.752887,
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });
  const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyleOption>(
    MAP_STYLES[0]
  );

  // UI state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    priceRange: [5000000, 50000000],
    bedrooms: "any",
    propertyType: "any",
    furnished: false,
  });

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
  };

  // Filter properties based on filter values
  const filteredProperties = useMemo(() => {
    return propertyListings.filter((property) => {
      // Filter by price range
      if (
        property.price < filterValues.priceRange[0] ||
        property.price > filterValues.priceRange[1]
      ) {
        return false;
      }

      // Filter by bedrooms
      if (
        filterValues.bedrooms !== "any" &&
        filterValues.bedrooms !== property.bedrooms.toString()
      ) {
        if (filterValues.bedrooms === "4+" && property.bedrooms < 4) {
          return false;
        } else if (
          filterValues.bedrooms !== "4+" &&
          property.bedrooms.toString() !== filterValues.bedrooms
        ) {
          return false;
        }
      }

      // Filter by property type
      if (
        filterValues.propertyType !== "any" &&
        property.type.toLowerCase() !== filterValues.propertyType.toLowerCase()
      ) {
        return false;
      }

      // Filter by furnished
      if (filterValues.furnished && !property.furnished) {
        return false;
      }

      return true;
    });
  }, [filterValues, propertyListings]);

  // Reset measurement
  const resetMeasurement = () => {
    setMeasurePoints([]);
    setMeasureDistance(0);
    setCurrentMousePosition(null);
    setIsMeasuring(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Main Map Component */}
      <MapView
        mapRef={mapRef}
        viewState={viewState}
        setViewState={setViewState}
        selectedMapStyle={selectedMapStyle}
        setSelectedMapStyle={setSelectedMapStyle}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        setSelectedPOI={setSelectedPOI}
        calculateDistance={calculateDistance}
        currentMousePosition={currentMousePosition}
        setCurrentMousePosition={setCurrentMousePosition}
        isMeasuring={isMeasuring}
        setIsMeasuring={setIsMeasuring}
        measurePoints={measurePoints}
        setMeasurePoints={setMeasurePoints}
        measureDistance={measureDistance}
        setMeasureDistance={setMeasureDistance}
        popupInfo={popupInfo}
        setPopupInfo={setPopupInfo}
        selectedPOI={selectedPOI}
        showPOI={showPOI}
        showPins={showPins}
        filteredProperties={filteredProperties}
        resetMeasurement={resetMeasurement}
      />

      {/* Top Navigation Bar */}
      <TopNavigationBar
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        filteredProperties={filteredProperties}
      />

      {/* Map Controls */}
      <MapControls
        mapRef={mapRef}
        viewState={viewState}
        setViewState={setViewState}
        selectedMapStyle={selectedMapStyle}
        setSelectedMapStyle={setSelectedMapStyle}
        is3DMode={is3DMode}
        setIs3DMode={setIs3DMode}
        showPins={showPins}
        setShowPins={setShowPins}
        showPOI={showPOI}
        setShowPOI={setShowPOI}
        isMeasuring={isMeasuring}
        setIsMeasuring={setIsMeasuring}
        setPopupInfo={setPopupInfo}
        resetMeasurement={resetMeasurement}
      />

      {/* Add Property Button */}
      <AddPropertyDialog />

      {/* Property Details Panel */}
      <PropertyDetailsPanel
        viewState={viewState}
        setViewState={setViewState}
        propertyListings={propertyListings}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        selectedPOI={selectedPOI}
        setSelectedPOI={setSelectedPOI}
        calculateDistance={calculateDistance}
      />
    </div>
  );
}
