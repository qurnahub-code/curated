import { useState } from "react";
import { Package, BarChart3, ShoppingBag, Plus, Loader2, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListingsTab } from "./seller-tabs/ListingsTab";
import { AnalyticsTab } from "./seller-tabs/AnalyticsTab";
import { OrdersTab } from "./seller-tabs/OrdersTab";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSellerDashboardData, createProductListing } from "@/lib/api/storefront.functions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";

const CREATION_CATEGORIES = [
  "Templates",
  "UI Kits",
  "Icons",
  "Fonts",
  "Code",
  "3D Assets",
  "Illustrations",
  "Audio",
];

export function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("listings");
  const [openNewListing, setOpenNewListing] = useState(false);
  const queryClient = useQueryClient();

  // Form States
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user, signOut } = useAuth();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["seller-dashboard-data"],
    queryFn: () => fetchSellerDashboardData(),
  });

  const createListingMutation = useMutation({
    mutationFn: (newListing: any) => createProductListing({ data: newListing }),
    onSuccess: () => {
      toast.success("Listing created successfully!");
      queryClient.invalidateQueries({ queryKey: ["seller-dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpenNewListing(false);
      // Reset form
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageFile(null);
      setTagsInput("");
      setIsUploading(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create listing.");
      setIsUploading(false);
    },
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category || !description || !imageFile) {
      toast.error("Please fill in all required fields and select an image.");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    try {
      setIsUploading(true);

      // Compress image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageFile, options);

      // Upload to Supabase
      const fileName = `${Date.now()}_${compressedFile.name}`;
      const { data, error } = await supabase.storage
        .from("product-assets")
        .upload(fileName, compressedFile);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("product-assets")
        .getPublicUrl(fileName);

      createListingMutation.mutate({
        title,
        description,
        price: priceNum,
        category,
        image: publicUrl,
        tags,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-10 w-full sm:w-80" />
        <Skeleton className="h-64 w-full rounded-xl mt-4" />
      </div>
    );
  }

  const productsList = dashboardData?.products ?? [];
  const ordersList = dashboardData?.orders ?? [];
  const analyticsData = dashboardData?.analytics ?? {
    totalRevenue: 0,
    totalSales: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    monthlyRevenue: [],
    topProducts: [],
    weeklyViews: [],
  };

  // Filter listings to simulate the seller's specific listings (Studio M products)
  const myListings = productsList.filter((p) => p.seller === "Studio M");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Seller Dashboard
          </h2>
          <p className="font-body text-sm text-muted-foreground">
            Manage your products, track performance, and view orders
            {user && ` • Logged in as ${user.email}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={signOut}
            className="font-body gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Button
            onClick={() => setOpenNewListing(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Listing
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/60 border border-border p-1 w-full sm:w-auto">
          <TabsTrigger
            value="listings"
            className="font-body data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 cursor-pointer"
          >
            <Package className="h-4 w-4" />
            <span>My Listings ({myListings.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="font-body data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 cursor-pointer"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="font-body data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders ({ordersList.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="mt-6">
          <ListingsTab products={myListings} />
        </TabsContent>
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab analytics={analyticsData} />
        </TabsContent>
        <TabsContent value="orders" className="mt-6">
          <OrdersTab orders={ordersList} />
        </TabsContent>
      </Tabs>

      {/* New Listing Modal Dialog */}
      <Dialog open={openNewListing} onOpenChange={setOpenNewListing}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleCreateListing}>
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-foreground">
                Create New Listing
              </DialogTitle>
              <DialogDescription className="font-body text-sm text-muted-foreground mt-1">
                Upload a new premium digital asset to the Curated marketplace.
              </DialogDescription>
            </DialogHeader>

            <div className="my-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="font-body text-sm font-medium">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Minimalist Portfolio Template"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={createListingMutation.isPending}
                    className="font-body"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price" className="font-body text-sm font-medium">
                    Price ($) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.99"
                    placeholder="29.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={createListingMutation.isPending}
                    className="font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category" className="font-body text-sm font-medium">
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full bg-card border-border font-body text-sm">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CREATION_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-body">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="image" className="font-body text-sm font-medium">
                    Image File *
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    required
                    disabled={createListingMutation.isPending || isUploading}
                    className="font-body file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="font-body text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Detail what is included, file format, pages, templates..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  disabled={createListingMutation.isPending}
                  className="font-body resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tags" className="font-body text-sm font-medium">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  placeholder="portfolio, minimal, template"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  disabled={createListingMutation.isPending}
                  className="font-body"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="font-body cursor-pointer"
                  disabled={createListingMutation.isPending}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="font-body bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer"
                disabled={createListingMutation.isPending || isUploading}
              >
                {(createListingMutation.isPending || isUploading) ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Creating..."}
                  </>
                ) : (
                  <>Create Listing</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

