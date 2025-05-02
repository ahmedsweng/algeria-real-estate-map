import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function AddPropertyDialog() {
  return (
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
  );
}

export default AddPropertyDialog;
