import { poiData } from "@/lib/mock-data";
import {
  ALGERIA_BOUNDS,
  MapStyleOption,
  MeasurePoint,
  POI,
  Property,
  ViewState,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Home, Hospital, School } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import Map, {
  Marker,
  NavigationControl,
  Popup,
  ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import { MeasurementTool } from "./MeasurementTool";

interface MapProps {
  mapRef: React.RefObject<any>;
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
  selectedMapStyle: MapStyleOption;
  setSelectedMapStyle: (style: MapStyleOption) => void;
  filteredProperties: Property[];
  setSelectedProperty: (property: Property | null) => void;
  selectedProperty: Property | null;
  setSelectedPOI: (poi: POI | null) => void;
  isMeasuring: boolean;
  setIsMeasuring: (isMeasuring: boolean) => void;
  measurePoints: MeasurePoint[];
  setMeasurePoints: Dispatch<SetStateAction<MeasurePoint[]>>;
  measureDistance: number;
  setMeasureDistance: Dispatch<SetStateAction<number>>;
  resetMeasurement: () => void;
  calculateDistance: (
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ) => number;
  currentMousePosition: MeasurePoint | null;
  setCurrentMousePosition: (point: MeasurePoint | null) => void;
  popupInfo: { longitude: number; latitude: number; content: string } | null;
  setPopupInfo: (
    info: { longitude: number; latitude: number; content: string } | null
  ) => void;
  showPins: boolean;
  showPOI: boolean;
  selectedPOI: POI | null;
}

function MapView({
  mapRef,
  viewState,
  selectedMapStyle,
  filteredProperties,
  setSelectedProperty,
  selectedProperty,
  setSelectedPOI,
  isMeasuring,
  setIsMeasuring,
  measurePoints,
  setMeasurePoints,
  measureDistance,
  setMeasureDistance,
  resetMeasurement,
  calculateDistance,
  currentMousePosition,
  setCurrentMousePosition,
  popupInfo,
  setViewState,
  showPins,
  showPOI,
  selectedPOI,
}: MapProps) {
  // Handle property selection
  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setSelectedPOI(null);
  };

  // Handle POI selection
  const handlePOIClick = (poi: POI) => {
    setSelectedPOI(poi);
    setSelectedProperty(null);
  };

  // Handle map click for measurement
  const handleMapClick = (e: { lngLat: { lng: number; lat: number } }) => {
    if (!isMeasuring) return;

    const newPoint: MeasurePoint = [e.lngLat.lng, e.lngLat.lat];
    const newPoints = [...measurePoints, newPoint];
    setMeasurePoints(newPoints);

    // Calculate distance if we have at least 2 points
    if (newPoints.length >= 2) {
      const lastIndex = newPoints.length - 1;
      const p1 = newPoints[lastIndex - 1];
      const p2 = newPoints[lastIndex];

      // Calculate distance
      const distance = calculateDistance(p1[0], p1[1], p2[0], p2[1]);
      setMeasureDistance((prevDistance) => {
        return prevDistance + distance;
      });
    }
  };

  const handleViewStateChange = (e: ViewStateChangeEvent) => {
    const { longitude, latitude, zoom } = e.viewState;

    // Restrict to Algeria bounds
    const newViewState = {
      ...e.viewState,
      longitude: Math.max(
        ALGERIA_BOUNDS.west,
        Math.min(ALGERIA_BOUNDS.east, longitude)
      ),
      latitude: Math.max(
        ALGERIA_BOUNDS.south,
        Math.min(ALGERIA_BOUNDS.north, latitude)
      ),
      zoom: Math.max(
        ALGERIA_BOUNDS.minZoom,
        Math.min(ALGERIA_BOUNDS.maxZoom, zoom)
      ),
    } as ViewState;

    setViewState(newViewState);
  };

  // Handle mouse move for measurement line preview
  const handleMouseMove = (e: { lngLat: { lng: number; lat: number } }) => {
    if (isMeasuring && measurePoints.length > 0) {
      setCurrentMousePosition([e.lngLat.lng, e.lngLat.lat]);
    }
  };

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={handleViewStateChange}
      mapStyle={selectedMapStyle.url}
      mapboxAccessToken="pk.eyJ1IjoiYWhtZWRzd2VuZyIsImEiOiJjbTllaTE1bGMxNWx0Mmxxd3M2MGhmem52In0.eyKAevuPCdcYuR258Lt2-w" // Replace with your actual token
      style={{ width: "100%", height: "100%" }}
      onClick={handleMapClick}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => {
        e.preventDefault();
        if (isMeasuring) {
          resetMeasurement();
        }
      }}
      maxPitch={85}
      minZoom={ALGERIA_BOUNDS.minZoom}
      maxZoom={ALGERIA_BOUNDS.maxZoom}
      maxBounds={[
        [ALGERIA_BOUNDS.west, ALGERIA_BOUNDS.south], // Southwest coordinates
        [ALGERIA_BOUNDS.east, ALGERIA_BOUNDS.north], // Northeast coordinates
      ]}
    >
      {/* Navigation Controls */}
      <NavigationControl position="bottom-right" showCompass={true} />

      {/* Measurement Tool */}
      <MeasurementTool
        isMeasuring={isMeasuring}
        measurePoints={measurePoints}
        measureDistance={measureDistance}
        resetMeasurement={resetMeasurement}
        currentMousePosition={currentMousePosition}
      />

      {/* Property Markers */}
      {showPins &&
        filteredProperties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.longitude}
            latitude={property.latitude}
            onClick={() => handlePropertyClick(property)}
          >
            <div
              className={cn(
                "map-marker map-marker-property",
                selectedProperty?.id === property.id ? "selected" : "default"
              )}
            >
              <Home className="h-5 w-5" />
            </div>
          </Marker>
        ))}

      {/* POI Markers */}
      {showPOI &&
        poiData.map((poi) => (
          <Marker
            key={poi.id}
            longitude={poi.longitude}
            latitude={poi.latitude}
            onClick={() => handlePOIClick(poi)}
          >
            <div
              className={cn(
                "map-marker map-marker-poi",
                `${poi.type}`,
                selectedPOI?.id === poi.id ? "selected" : ""
              )}
            >
              {poi.type === "school" && <School className="h-4 w-4" />}
              {poi.type === "hospital" && <Hospital className="h-4 w-4" />}
              {poi.type === "shopping" && <div className="h-4 w-4">🛒</div>}
              {poi.type === "restaurant" && <div className="h-4 w-4">🍽️</div>}
            </div>
          </Marker>
        ))}

      {/* Location Popup */}
      {popupInfo && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeButton={false}
          closeOnClick={false}
          className="z-10"
        >
          <div className="p-1 text-xs">{popupInfo.content}</div>
        </Popup>
      )}
    </Map>
  );
}

export default MapView;
