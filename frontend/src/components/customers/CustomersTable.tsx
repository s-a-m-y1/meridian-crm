"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Users, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, apiErrorMessage } from "@/lib/api";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const limit = 20;

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (search) params.search = search;
      
      const response = await api.getCustomers(params);
      setCustomers(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const handleDelete = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.deleteCustomer(customerId);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer database</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Customer
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Contact</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Phone</th>
                  <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Date Added</th>
                  <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{customer.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{customer.email || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{customer.phone || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedCustomer(customer); setShowDetail(true); }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => { /* edit */ }}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(customer.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {customers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No customers found</p>
              <Button variant="outline" className="mt-3" onClick={() => setShowCreate(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} customers
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

      {/* Customer Detail Modal */}
      {showDetail && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b flex items-center justify-between">
              <CardTitle className="text-xl">{selectedCustomer.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowDetail(false); setSelectedCustomer(null); }}>
                <Eye className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedCustomer.email || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedCustomer.phone || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                  <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</label>
                  <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedCustomer.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setShowDetail(false); setSelectedCustomer(null); }}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => { /* edit */ }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedCustomer.id); setShowDetail(false); setSelectedCustomer(null); }}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Create Customer Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xl">Create New Customer</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CreateCustomerForm onClose={() => setShowCreate(false)} onSuccess={fetchCustomers} />
            </CardContent>
          </div>
        </div>
      )}

      {isLoading && customers.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

function CreateCustomerForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.createCustomer(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create customer:", error);
      setError(apiErrorMessage(error, "Failed to create customer. Please check the fields."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Name *</label>
        <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+20 10 1234 5678" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Customer"}
        </Button>
      </div>
    </form>
  );
}