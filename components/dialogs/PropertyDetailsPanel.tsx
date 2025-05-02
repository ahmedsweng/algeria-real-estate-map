import { POI, Property, ViewState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ResizablePanel } from "../ui/resizable-panel";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface PropertyDetailsPanelProps {
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  selectedPOI: POI | null;
  setSelectedPOI: (poi: POI | null) => void;
  propertyListings: Property[];
  viewState: ViewState;
  setViewState: (viewState: ViewState) => void;
  calculateDistance: (
    lon1: number,
    lat1: number,
    lon2: number,
    lat2: number
  ) => number;
}

function PropertyDetailsPanel({
  selectedProperty,
  setSelectedProperty,
  selectedPOI,
  setSelectedPOI,
  propertyListings,
  viewState,
  setViewState,
  calculateDistance,
}: PropertyDetailsPanelProps) {
  return (
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
  );
}

export default PropertyDetailsPanel;
