"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Plus, Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, Eye, Target, DollarSign, MapPin, Phone, Mail, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api, apiErrorMessage } from "@/lib/api";

const LEAD_STATUSES = [
  { value: "NEW", label: "New", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "CONTACTED", label: "Contacted", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "QUALIFIED", label: "Qualified", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "UNQUALIFIED", label: "Unqualified", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400" },
  { value: "CONVERTED", label: "Converted", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
];

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  source: string;
  budgetMin?: string;
  budgetMax?: string;
  requestedPropertyType?: string;
  requestedLocation?: string;
  aiScore?: number;
  aiClassification?: string;
  customerId?: string;
  ownerId?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadsResponse {
  data: Lead[];
  total: number;
  page: number;
  limit: number;
}

export function LeadsKanban() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const limit = 50;

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      
      const response = await api.getLeads(params);
      setLeads(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, search, statusFilter]);

  const getStatusConfig = (status: string) => {
    return LEAD_STATUSES.find(s => s.value === status) || LEAD_STATUSES[0];
  };

  const groupedLeads = LEAD_STATUSES.map(status => ({
    status: status.value,
    label: status.label,
    color: status.color,
    leads: leads.filter(l => l.status === status.value),
  }));

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await api.updateLead(leadId, { status: newStatus });
      fetchLeads();
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const handleDelete = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.deleteLead(leadId);
      fetchLeads();
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  const formatBudget = (lead: Lead) => {
    if (lead.budgetMin && lead.budgetMax) {
      return `$${Number(lead.budgetMin).toLocaleString()} - $${Number(lead.budgetMax).toLocaleString()}`;
    }
    if (lead.budgetMin) return `From $${Number(lead.budgetMin).toLocaleString()}`;
    if (lead.budgetMax) return `Up to $${Number(lead.budgetMax).toLocaleString()}`;
    return "Not specified";
  };

  const LeadCard = ({ lead, draggable, onDragStart, className, ...props }: { lead: Lead } & React.HTMLAttributes<HTMLDivElement>) => {
    const statusConfig = getStatusConfig(lead.status);
    return (
      <div 
        draggable={draggable}
        onDragStart={onDragStart}
        className={cn("bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer", className)}
        {...props}
        onClick={() => { setSelectedLead(lead); setShowDetail(true); }}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">{lead.name}</h4>
          <Badge variant="secondary" className={cn("text-xs", statusConfig.color)}>
            {statusConfig.label}
          </Badge>
        </div>
        
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Phone className="w-3.5 h-3.5" />
            <span>{lead.phone}</span>
          </div>
        )}

        {lead.requestedLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{lead.requestedLocation}</span>
          </div>
        )}

        {lead.requestedPropertyType && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>{lead.requestedPropertyType}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{formatBudget(lead)}</span>
        </div>

        {lead.aiScore && (
          <div className="flex items-center gap-2 text-xs mb-2">
            <Target className="w-3 h-3 text-primary" />
            <span className="font-medium">AI Score: {lead.aiScore}</span>
            {lead.aiClassification && (
              <Badge variant="secondary" className="text-xs">
                {lead.aiClassification}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Badge variant="outline" className="text-xs">{lead.source}</Badge>
          <span className="text-xs text-gray-400">
            {new Date(lead.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  const KanbanColumn = ({ status, label, color, leads: columnLeads }: { 
    status: string; 
    label: string; 
    color: string; 
    leads: Lead[]; 
  }) => (
    <div className="flex flex-col min-w-[280px] max-w-[280px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", color)} />
          <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
          <Badge variant="secondary" className={cn(color, "text-xs")}>
            {columnLeads.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-3 min-h-[200px] bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-2" 
           onDragOver={(e) => e.preventDefault()}
           onDrop={(e) => {
             e.preventDefault();
             const leadId = e.dataTransfer.getData("leadId");
             if (leadId) handleStatusChange(leadId, status);
           }}>
        {columnLeads.map(lead => (
          <LeadCard 
            key={lead.id} 
            lead={lead}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("leadId", lead.id)}
            className="cursor-grab active:cursor-grabbing"
          />
        ))}
        {columnLeads.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drop leads here
          </div>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 w-full"
        onClick={() => { setShowCreate(true); }}
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Lead
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your leads through the pipeline</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              {LEAD_STATUSES.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {groupedLeads.map(column => (
            <KanbanColumn key={column.status} {...column} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} leads
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

      {/* Lead Detail Modal */}
      {showDetail && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b flex items-center justify-between">
              <CardTitle className="text-xl">{selectedLead.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowDetail(false); setSelectedLead(null); }}>
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <p className="text-gray-900 dark:text-white">{selectedLead.email || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                  <p className="text-gray-900 dark:text-white">{selectedLead.phone || "—"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                  <Badge variant="secondary" className={cn(getStatusConfig(selectedLead.status).color, "mt-1")}>
                    {getStatusConfig(selectedLead.status).label}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</label>
                  <Badge variant="outline" className="mt-1">{selectedLead.source}</Badge>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</label>
                  <p className="text-gray-900 dark:text-white mt-1">{formatBudget(selectedLead)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedLead.requestedLocation || "—"}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Property Type</label>
                  <p className="text-gray-900 dark:text-white mt-1">{selectedLead.requestedPropertyType || "—"}</p>
                </div>
                {selectedLead.aiScore && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Score</label>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-2xl font-bold text-primary">{selectedLead.aiScore}</span>
                      {selectedLead.aiClassification && (
                        <Badge variant="secondary">{selectedLead.aiClassification}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setShowDetail(false); setSelectedLead(null); }}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => { /* edit */ }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedLead.id); setShowDetail(false); setSelectedLead(null); }}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xl">Create New Lead</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CreateLeadForm onClose={() => setShowCreate(false)} onSuccess={fetchLeads} />
            </CardContent>
          </div>
        </div>
      )}

      {isLoading && leads.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

function CreateLeadForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", status: "NEW", source: "WEBSITE",
    budgetMin: "", budgetMax: "", requestedPropertyType: "", requestedLocation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await api.createLead(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create lead:", error);
      setError(apiErrorMessage(error, "Failed to create lead. Please check the fields."));
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
      <div>
        <label className="block text-sm font-medium mb-1">Source</label>
        <Select value={formData.source} onValueChange={v => setFormData({...formData, source: v})}>
          <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="WEBSITE">Website</SelectItem>
            <SelectItem value="REFERRAL">Referral</SelectItem>
            <SelectItem value="PHONE">Phone</SelectItem>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="SOCIAL">Social Media</SelectItem>
            <SelectItem value="WALK_IN">Walk In</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
          <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Min Budget</label>
          <Input type="number" value={formData.budgetMin} onChange={e => setFormData({...formData, budgetMin: e.target.value})} placeholder="500000" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Budget</label>
          <Input type="number" value={formData.budgetMax} onChange={e => setFormData({...formData, budgetMax: e.target.value})} placeholder="1000000" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Property Type</label>
        <Select value={formData.requestedPropertyType} onValueChange={v => setFormData({...formData, requestedPropertyType: v})}>
          <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="APARTMENT">Apartment</SelectItem>
            <SelectItem value="VILLA">Villa</SelectItem>
            <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
            <SelectItem value="COMMERCIAL">Commercial</SelectItem>
            <SelectItem value="LAND">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <Input value={formData.requestedLocation} onChange={e => setFormData({...formData, requestedLocation: e.target.value})} placeholder="Cairo, New Cairo, etc." />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}