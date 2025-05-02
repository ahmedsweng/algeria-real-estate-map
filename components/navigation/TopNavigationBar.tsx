import { propertyListings } from "@/lib/mock-data";
import { FilterValues, Property } from "@/lib/types";
import { Filter, MapPin, Search, User } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";

interface TopNavigationBarProps {
  filteredProperties: Property[];
  filterValues: FilterValues;
  setFilterValues: (values: FilterValues) => void;
}

export default function TopNavigationBar({
  filteredProperties = propertyListings,
  filterValues,
  setFilterValues,
}: TopNavigationBarProps) {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Apply filters
  const applyFilters = () => {
    setShowFilters(false);
  };

  return (
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
                  <span>{filterValues.priceRange[0].toLocaleString()} DZD</span>
                  <span>{filterValues.priceRange[1].toLocaleString()} DZD</span>
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
  );
}
