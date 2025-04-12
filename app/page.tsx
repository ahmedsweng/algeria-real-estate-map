"use client";

import { MeasurementTool } from "@/components/measurment-tool";
import { ResizablePanel } from "@/components/resizable-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { poiData, propertyListings } from "@/lib/mock-data";
import type {
  FilterValues,
  MapStyleOption,
  MeasurePoint,
  POI,
  Property,
  ViewState,
} from "@/lib/types";
import { ALGERIA_BOUNDS, MAP_STYLES } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CuboidIcon as Cube,
  Eye,
  EyeOff,
  Filter,
  Home,
  Hospital,
  Layers,
  MapPin,
  Plus,
  Ruler,
  School,
  Search,
  User,
  X,
} from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  type MapRef,
  Marker,
  NavigationControl,
  Popup,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";

export default function HomePage() {
  const mapRef = useRef<MapRef>(null);
  const { theme } = useTheme();

  // Map state
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
  const [is3DMode, setIs3DMode] = useState<boolean>(false);

  // UI state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showPins, setShowPins] = useState<boolean>(true);
  const [showPOI, setShowPOI] = useState<boolean>(false);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<MeasurePoint[]>([]);
  const [measureDistance, setMeasureDistance] = useState<number>(0);
  const [currentMousePosition, setCurrentMousePosition] =
    useState<MeasurePoint | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    priceRange: [5000000, 50000000],
    bedrooms: "any",
    propertyType: "any",
    furnished: false,
  });
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    content: string;
  } | null>(null);

  // Update map style based on theme
  useEffect(() => {
    if (theme === "dark" && !selectedMapStyle.darkMode) {
      // Switch to a dark mode map style when theme changes to dark
      setSelectedMapStyle(
        MAP_STYLES.find((style) => style.id === "dark") || MAP_STYLES[0]
      );
    } else if (theme === "light" && selectedMapStyle.darkMode) {
      // Switch to a light mode map style when theme changes to light
      setSelectedMapStyle(
        MAP_STYLES.find((style) => style.id === "streets") || MAP_STYLES[0]
      );
    }
  }, [theme, selectedMapStyle.darkMode]);

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
      setMeasureDistance((prevDistance) => prevDistance + distance);
    }
  };

  // Handle mouse move for measurement line preview
  const handleMouseMove = (e: { lngLat: { lng: number; lat: number } }) => {
    if (isMeasuring && measurePoints.length > 0) {
      setCurrentMousePosition([e.lngLat.lng, e.lngLat.lat]);
    }
  };

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

  // Reset measurement
  const resetMeasurement = () => {
    setMeasurePoints([]);
    setMeasureDistance(0);
    setCurrentMousePosition(null);
    setIsMeasuring(false);
  };

  // Get user's current location with high accuracy
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setPopupInfo({
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        content: "Locating you...",
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          // Check if the location is within Algeria bounds
          if (
            longitude >= ALGERIA_BOUNDS.west &&
            longitude <= ALGERIA_BOUNDS.east &&
            latitude >= ALGERIA_BOUNDS.south &&
            latitude <= ALGERIA_BOUNDS.north
          ) {
            setViewState({
              ...viewState,
              latitude,
              longitude,
              zoom: 14,
            });

            setPopupInfo({
              longitude,
              latitude,
              content: "Your location",
            });

            // Hide popup after 3 seconds
            setTimeout(() => {
              setPopupInfo(null);
            }, 3000);
          } else {
            setPopupInfo({
              longitude: viewState.longitude,
              latitude: viewState.latitude,
              content: "Your location is outside Algeria",
            });

            // Hide popup after 3 seconds
            setTimeout(() => {
              setPopupInfo(null);
            }, 3000);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setPopupInfo({
            longitude: viewState.longitude,
            latitude: viewState.latitude,
            content: "Could not determine your location",
          });

          // Hide popup after 3 seconds
          setTimeout(() => {
            setPopupInfo(null);
          }, 3000);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setPopupInfo({
        longitude: viewState.longitude,
        latitude: viewState.latitude,
        content: "Geolocation is not supported",
      });

      // Hide popup after 3 seconds
      setTimeout(() => {
        setPopupInfo(null);
      }, 3000);
    }
  };

  // Toggle 3D mode
  const toggle3DMode = () => {
    const newIs3DMode = !is3DMode;
    setIs3DMode(newIs3DMode);

    if (mapRef.current) {
      mapRef.current.easeTo({
        pitch: newIs3DMode ? 60 : 0,
        duration: 1000,
      });
    }
  };

  // Handle view state change
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

  // Apply filters
  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Main Map Component */}
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
          setIsMeasuring={setIsMeasuring}
          measurePoints={measurePoints}
          setMeasurePoints={setMeasurePoints}
          measureDistance={measureDistance}
          setMeasureDistance={setMeasureDistance}
          handleMapClick={handleMapClick}
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

      {/* Top Navigation Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-10">
        <Button variant="outline" size="icon" className="bg-background">
          <MapPin className="h-5 w-5" />
        </Button>

        <div className="relative flex-1 max-w-2xl">
          <Input
            className="pl-10 pr-4 py-2 shadow-md rounded-md w-full bg-background"
            placeholder="Search for locations, neighborhoods, or properties..."
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Filter className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end" sideOffset={5}>
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Price Range (DZD)</Label>
                  <div className="pt-2">
                    <Slider
                      defaultValue={filterValues.priceRange}
                      min={1000000}
                      max={100000000}
                      step={1000000}
                      onValueChange={(value) =>
                        setFilterValues({
                          ...filterValues,
                          priceRange: value as [number, number],
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      {filterValues.priceRange[0].toLocaleString()} DZD
                    </span>
                    <span>
                      {filterValues.priceRange[1].toLocaleString()} DZD
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select
                    defaultValue={filterValues.bedrooms}
                    onValueChange={(value) =>
                      setFilterValues({ ...filterValues, bedrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    defaultValue={filterValues.propertyType}
                    onValueChange={(value) =>
                      setFilterValues({ ...filterValues, propertyType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="furnished"
                    checked={filterValues.furnished}
                    onCheckedChange={(checked) =>
                      setFilterValues({ ...filterValues, furnished: checked })
                    }
                  />
                  <Label htmlFor="furnished">Furnished</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={applyFilters}>
                  Apply Filters ({filteredProperties.length} properties)
                </Button>
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <User className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Account</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline">Register</Button>
              <Button>Login</Button>
            </div>
          </DialogContent>
        </Dialog>

        <ThemeToggle />
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="bg-background"
          onClick={getUserLocation}
        >
          <div className="h-5 w-5">📍</div>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Layers className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>Map Type</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 py-4">
              {MAP_STYLES.map((style) => (
                <Button
                  key={style.id}
                  variant={
                    selectedMapStyle.id === style.id ? "default" : "outline"
                  }
                  className="w-full justify-start"
                  onClick={() => setSelectedMapStyle(style)}
                >
                  <div className="mr-2">{style.icon}</div> {style.name}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant={is3DMode ? "default" : "outline"}
          size="icon"
          className={cn(
            "bg-background",
            is3DMode && "bg-primary text-primary-foreground"
          )}
          onClick={toggle3DMode}
        >
          <Cube className="h-5 w-5" />
        </Button>

        <Button
          variant={showPOI ? "default" : "outline"}
          size="icon"
          className={cn(
            "bg-background",
            showPOI && "bg-primary text-primary-foreground"
          )}
          onClick={() => setShowPOI(!showPOI)}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            {showPOI ? (
              <Hospital className="h-4 w-4" />
            ) : (
              <School className="h-4 w-4" />
            )}
          </div>
        </Button>

        <Button
          variant={isMeasuring ? "default" : "outline"}
          size="icon"
          className={cn(
            "bg-background",
            isMeasuring && "bg-primary text-primary-foreground"
          )}
          onClick={() => {
            if (isMeasuring) {
              resetMeasurement();
            } else {
              setIsMeasuring(true);
            }
          }}
        >
          <Ruler className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="bg-background"
          onClick={() => setShowPins(!showPins)}
        >
          {showPins ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Add Property Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute bottom-4 right-4 rounded-full shadow-lg z-10"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Property</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Property Title</Label>
              <Input id="title" placeholder="Enter property title" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="price">Price (DZD)</Label>
                <Input id="price" type="number" placeholder="Price" />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select defaultValue="apartment">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" type="number" placeholder="Bedrooms" />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" type="number" placeholder="Bathrooms" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe the property"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">Images</Label>
              <Input id="images" type="file" multiple />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="furnished" />
              <Label htmlFor="furnished">Furnished</Label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Add Property</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Property Details Panel */}
      <ResizablePanel
        side="left"
        isOpen={!!selectedProperty || !!selectedPOI}
        onOpenChange={() => {
          setSelectedProperty(null);
          setSelectedPOI(null);
        }}
        defaultWidth={400}
        minWidth={300}
        maxWidth={600}
        className="bg-background border-r border-border"
      >
        {selectedProperty && (
          <>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedProperty.title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedProperty(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-6">
                  {/* Property Images */}
                  <div className="relative h-64 overflow-hidden rounded-lg">
                    <img
                      src={selectedProperty.images[0] || "/home.jpg"}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      1/{selectedProperty.images.length}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold">
                        {selectedProperty.price.toLocaleString()} DZD
                      </div>
                      <Badge>{selectedProperty.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProperty.address}
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="grid grid-cols-3 gap-4 py-2">
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold">
                        {selectedProperty.bedrooms}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bedrooms
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold">
                        {selectedProperty.bathrooms}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bathrooms
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-semibold">
                        {selectedProperty.area}
                      </div>
                      <div className="text-xs text-muted-foreground">m²</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm">{selectedProperty.description}</p>
                  </div>

                  <Separator />

                  {/* Features */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProperty.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Contact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Contact Agent</h3>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage
                          src={
                            selectedProperty.agent.avatar || "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {selectedProperty.agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {selectedProperty.agent.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedProperty.agent.phone}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full">Contact Agent</Button>
                  </div>

                  {/* Map Location */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Location</h3>
                    <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                      <Button
                        onClick={() => {
                          setViewState({
                            ...viewState,
                            longitude: selectedProperty.longitude,
                            latitude: selectedProperty.latitude,
                            zoom: 16,
                          });
                        }}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {selectedPOI && (
          <>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{selectedPOI.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPOI(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-6">
                  {/* POI Image */}
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    <img
                      src={
                        selectedPOI.image ||
                        `/placeholder.svg?text=${selectedPOI.type}`
                      }
                      alt={selectedPOI.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={cn(
                        "absolute top-2 right-2 px-2 py-1 rounded text-xs text-white",
                        selectedPOI.type === "school"
                          ? "bg-amber-500"
                          : selectedPOI.type === "hospital"
                          ? "bg-red-500"
                          : selectedPOI.type === "shopping"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      )}
                    >
                      {selectedPOI.type.charAt(0).toUpperCase() +
                        selectedPOI.type.slice(1)}
                    </div>
                  </div>

                  {/* POI Details */}
                  <div className="space-y-2">
                    <div className="flex items-center">
                      {selectedPOI.rating && (
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "text-yellow-500",
                                  i < selectedPOI.rating!
                                    ? "fill-current"
                                    : "stroke-current opacity-30"
                                )}
                              >
                                ★
                              </div>
                            ))}
                          <span className="ml-1 text-sm">
                            {selectedPOI.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPOI.address}
                    </div>
                  </div>

                  <Separator />

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm">{selectedPOI.description}</p>
                  </div>

                  <Separator />

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                      <div className="text-sm font-medium">Opening Hours:</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPOI.openingHours}
                      </div>

                      <div className="text-sm font-medium">Contact:</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedPOI.contact}
                      </div>

                      <div className="text-sm font-medium">Website:</div>
                      <div className="text-sm text-primary underline">
                        {selectedPOI.website}
                      </div>
                    </div>
                  </div>

                  {/* Nearby Properties */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Nearby Properties</h3>
                    <div className="grid gap-3">
                      {propertyListings
                        .filter(
                          (property) =>
                            calculateDistance(
                              property.longitude,
                              property.latitude,
                              selectedPOI.longitude,
                              selectedPOI.latitude
                            ) < 2000 // Properties within 2km
                        )
                        .slice(0, 3)
                        .map((property) => (
                          <div
                            key={property.id}
                            className="flex gap-3 p-2 rounded-md cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setSelectedProperty(property);
                              setSelectedPOI(null);
                            }}
                          >
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-sm">
                                {property.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {property.price.toLocaleString()} DZD
                              </div>
                              <div className="text-xs mt-1">
                                {property.bedrooms} bed • {property.bathrooms}{" "}
                                bath • {property.area}m²
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Map Location */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Location</h3>
                    <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                      <Button
                        onClick={() => {
                          setViewState({
                            ...viewState,
                            longitude: selectedPOI.longitude,
                            latitude: selectedPOI.latitude,
                            zoom: 16,
                          });
                        }}
                      >
                        View on Map
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </ResizablePanel>
    </div>
  );
}
