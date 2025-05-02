import { ALGERIA_BOUNDS, MAP_STYLES, ViewState } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CuboidIcon,
  Eye,
  EyeOff,
  Hospital,
  Layers,
  Ruler,
  School,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface MapControlsProps {
  is3DMode: boolean;
  setIs3DMode: (is3DMode: boolean) => void;
  showPins: boolean;
  setShowPins: (showPins: boolean) => void;
  showPOI: boolean;
  setShowPOI: (showPOI: boolean) => void;
  isMeasuring: boolean;
  setIsMeasuring: (isMeasuring: boolean) => void;
  setPopupInfo: (
    info: { longitude: number; latitude: number; content: string } | null
  ) => void;

  mapRef: React.RefObject<any>;
  viewState: ViewState;
  setViewState: (viewState: any) => void;
  selectedMapStyle: any;
  setSelectedMapStyle: (style: any) => void;
  resetMeasurement: () => void;
}

function MapControls({
  mapRef,
  viewState,
  setViewState,
  selectedMapStyle,
  setSelectedMapStyle,
  is3DMode,
  setIs3DMode,
  showPins,
  setShowPins,
  showPOI,
  setShowPOI,
  isMeasuring,
  setIsMeasuring,
  setPopupInfo,
  resetMeasurement,
}: MapControlsProps) {
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
  return (
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
        <CuboidIcon className="h-5 w-5" />
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
  );
}

export default MapControls;
