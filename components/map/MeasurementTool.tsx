"use client";
import { Button } from "@/components/ui/button";
import type { MeasurePoint, MeasurementLineGeoJSON } from "@/lib/types";
import { Ruler, X } from "lucide-react";
import { Layer, Source } from "react-map-gl/mapbox";

interface MeasurementToolProps {
  isMeasuring: boolean;
  measurePoints: MeasurePoint[];
  measureDistance: number;
  currentMousePosition?: MeasurePoint | null;
  resetMeasurement: () => void;
}

export function MeasurementTool({
  isMeasuring,
  measurePoints,
  measureDistance,
  currentMousePosition,
  resetMeasurement,
}: MeasurementToolProps) {
  // Create GeoJSON for completed measurement lines
  const measurementLinesGeoJSON: MeasurementLineGeoJSON = {
    type: "FeatureCollection",
    features:
      measurePoints.length > 1
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: measurePoints,
              },
              properties: {},
            },
          ]
        : [],
  };

  // Create GeoJSON for the current line being drawn (following mouse)
  const currentLineGeoJSON: MeasurementLineGeoJSON = {
    type: "FeatureCollection",
    features:
      measurePoints.length > 0 && currentMousePosition
        ? [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: [...measurePoints, currentMousePosition],
              },
              properties: {},
            },
          ]
        : [],
  };

  // Create GeoJSON for measurement points
  const pointsGeoJSON = {
    type: "FeatureCollection",
    features: measurePoints.map((point, index) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: point,
      },
      properties: {
        pointIndex: index,
        isFirst: index === 0,
        isLast: index === measurePoints.length - 1,
      },
    })),
  };

  // Create GeoJSON for distance labels
  const labelsGeoJSON = {
    type: "FeatureCollection",
    features:
      measurePoints.length > 1
        ? measurePoints.slice(1).map((point, index) => {
            const prevPoint = measurePoints[index];
            const midPoint: [number, number] = [
              (prevPoint[0] + point[0]) / 2,
              (prevPoint[1] + point[1]) / 2,
            ];
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: midPoint,
              },
              properties: {
                distance: calculateDistance(
                  prevPoint[0],
                  prevPoint[1],
                  point[0],
                  point[1]
                ).toFixed(0),
              },
            };
          })
        : [],
  };

  // Calculate distance between two points using Haversine formula
  function calculateDistance(
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ): number {
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
  }

  return (
    <>
      {/* Completed measurement lines */}
      {measurePoints.length > 1 && (
        <Source
          id="measurementLines"
          type="geojson"
          data={measurementLinesGeoJSON}
        >
          <Layer
            id="measure-lines"
            type="line"
            paint={{
              "line-color": "#FF5733",
              "line-width": 3,
            }}
          />
        </Source>
      )}

      {/* Current line being drawn */}
      {isMeasuring && measurePoints.length > 0 && currentMousePosition && (
        <Source id="currentLine" type="geojson" data={currentLineGeoJSON}>
          <Layer
            id="current-line"
            type="line"
            paint={{
              "line-color": "#FF5733",
              "line-width": 2,
              "line-dasharray": [2, 1],
            }}
          />
        </Source>
      )}

      {/* Measurement points */}
      {measurePoints.length > 0 && (
        <Source
          id="measurementPoints"
          type="geojson"
          data={pointsGeoJSON as any}
        >
          <Layer
            id="measure-points"
            type="circle"
            paint={{
              "circle-radius": 6,
              "circle-color": "#FF5733",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#FFFFFF",
            }}
          />
        </Source>
      )}

      {/* Distance labels */}
      {measurePoints.length > 1 && (
        <Source id="distanceLabels" type="geojson" data={labelsGeoJSON as any}>
          <Layer
            id="distance-labels"
            type="symbol"
            layout={{
              "text-field": "{distance}m",
              "text-font": ["Open Sans Regular"],
              "text-size": 12,
              "text-offset": [0, -1],
              "text-anchor": "center",
            }}
            paint={{
              "text-color": "#FFFFFF",
              "text-halo-color": "#000000",
              "text-halo-width": 1,
            }}
          />
        </Source>
      )}

      {/* Measurement Info Panel */}
      {isMeasuring && (
        <div className="absolute bottom-4 left-4 bg-background border border-border p-3 rounded-md shadow-md z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium flex items-center">
              <Ruler className="h-4 w-4 mr-2" />
              Measurement Tool
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={resetMeasurement}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {measurePoints.length === 0
              ? "Click on the map to start measuring"
              : `Total distance: ${measureDistance.toFixed(0)} meters`}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {measurePoints.length > 0
              ? "Click to add points, right-click to finish"
              : "Left-click to place first point"}
          </div>
        </div>
      )}
    </>
  );
}
