"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Filter, Home, Building, DollarSign, Loader2, ChevronLeft, ChevronRight, Edit, Trash2, Eye, MapPin, Bed } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Property {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: string;
  bedrooms: number;
  bathrooms?: number;
  area?: number;
  location: string;
  status: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface PropertiesResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}

const PROPERTY_CATEGORIES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "LAND", label: "Land" },
];

const PROPERTY_STATUSES = [
  { value: "AVAILABLE", label: "Available", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "RESERVED", label: "Reserved", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "SOLD", label: "Sold", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "RENTED", label: "Rented", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "OFF_MARKET", label: "Off Market", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400" },
];

export function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const limit = 20;

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (priceMin) params.priceMin = Number(priceMin);
      if (priceMax) params.priceMax = Number(priceMax);
      
      const response = await api.getProperties(params);
      setProperties(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, search, categoryFilter, statusFilter, priceMin, priceMax]);

  const getStatusConfig = (status: string) => {
    return PROPERTY_STATUSES.find(s => s.value === status) || PROPERTY_STATUSES[0];
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.deleteProperty(propertyId);
      fetchProperties();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Number(price));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Properties</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your property listings</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Property
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 pt-0">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search properties..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {PROPERTY_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {PROPERTY_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input type="number" placeholder="Min Price" value={priceMin} onChange={e => { setPriceMin(e.target.value); setPage(1); }} className="w-[140px]" />
              <Input type="number" placeholder="Max Price" value={priceMax} onChange={e => { setPriceMax(e.target.value); setPage(1); }} className="w-[140px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Property</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Price</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Details</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Location</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {properties.map(property => (
                  <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <p className="font-medium text-gray-900 dark:text-white">{property.name}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{property.category}</Badge>
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {formatPrice(property.price)}
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {property.bedrooms} BR
                        </span>
                        {property.bathrooms && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {property.bathrooms} BA
                          </span>
                        )}
                        {property.area && (
                          <span className="flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" />
                            {property.area} sqft
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{property.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className={cn(getStatusConfig(property.status).color)}>
                        {getStatusConfig(property.status).label}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedProperty(property); setShowDetail(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { /* edit */ }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(property.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {properties.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Home className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No properties found</p>
              <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Property
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} properties
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => p + 1)}
              disabled={page * limit >= total}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {showDetail && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b flex items-center justify-between">
              <CardTitle className="text-xl">{selectedProperty.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowDetail(false); setSelectedProperty(null); }}>
                <Eye className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">{selectedProperty.description || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                  <Badge variant="secondary" className="mt-1">{selectedProperty.category}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
                  <p className="text-gray-900 dark:text-white mt-1 text-xl font-bold">{formatPrice(selectedProperty.price)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <Badge variant="secondary" className={cn(getStatusConfig(selectedProperty.status).color, "mt-1")}>
                    {getStatusConfig(selectedProperty.status).label}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bedrooms</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedProperty.bedrooms}</p>
                </div>
                {selectedProperty.bathrooms && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bathrooms</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedProperty.bathrooms}</p>
                  </div>
                )}
                {selectedProperty.area && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Area (sqft)</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedProperty.area.toLocaleString()}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedProperty.location}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setShowDetail(false); setSelectedProperty(null); }}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => { /* edit */ }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedProperty.id); setShowDetail(false); setSelectedProperty(null); }}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Create Property Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xl">Create New Property</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CreatePropertyForm onClose={() => setShowCreate(false)} onSuccess={fetchProperties} />
            </CardContent>
          </div>
        </div>
      )}

      {isLoading && properties.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

function CreatePropertyForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "", description: "", category: "APARTMENT", price: "", bedrooms: 1,
    bathrooms: 1, area: "", location: "", status: "AVAILABLE",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createProperty({
        ...formData,
        price: String(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: formData.area ? Number(formData.area) : undefined,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Luxury Villa in Zamalek" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="Property description..."
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category *</label>
          <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {PROPERTY_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {PROPERTY_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price *</label>
        <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="8500000" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Bedrooms *</label>
          <Input type="number" min="0" required value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bathrooms</label>
          <Input type="number" min="0" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Area (sqft)</label>
          <Input type="number" min="0" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="2500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location *</label>
        <Input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Zamalek, Cairo" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Property"}
        </Button>
      </div>
    </form>
  );
}