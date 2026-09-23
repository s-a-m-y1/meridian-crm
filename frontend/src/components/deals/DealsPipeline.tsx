"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/Select";
import { Plus, Search, Filter, DollarSign, Target, TrendingUp, Loader2, ChevronLeft, ChevronRight, Edit, Trash2, Eye, MoreHorizontal, Home, Building, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface Deal {
  id: string;
  value: string;
  stage: string;
  leadId?: string;
  propertyId?: string;
  ownerId?: string;
  organizationId: string;
  closedAt?: string;
  expectedCloseDate?: string;
  aiCloseProbability?: number;
  createdAt: string;
  updatedAt: string;
  lead?: { name: string; email: string };
  property?: { name: string; location: string };
}

interface DealsResponse {
  data: Deal[];
  total: number;
  page: number;
  limit: number;
}

const DEAL_STAGES = [
  { value: "PROSPECTING", label: "Prospecting", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" },
  { value: "QUALIFICATION", label: "Qualification", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "PROPOSAL", label: "Proposal", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { value: "NEGOTIATION", label: "Negotiation", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "CLOSED_WON", label: "Closed Won", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { value: "CLOSED_LOST", label: "Closed Lost", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
];

export function DealsPipeline() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const limit = 50;

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit };
      if (search) params.search = search;
      if (stageFilter) params.stage = stageFilter;
      
      const response = await api.getDeals(params);
      setDeals(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, [page, search, stageFilter]);

  const getStageConfig = (stage: string) => {
    return DEAL_STAGES.find(s => s.value === stage) || DEAL_STAGES[0];
  };

  const groupedDeals = DEAL_STAGES.map(stage => ({
    stage: stage.value,
    label: stage.label,
    color: stage.color,
    deals: deals.filter(d => d.stage === stage.value),
  }));

  const handleStageChange = async (dealId: string, newStage: string) => {
    try {
      await api.updateDeal(dealId, { stage: newStage });
      fetchDeals();
    } catch (error) {
      console.error("Failed to update deal stage:", error);
    }
  };

  const handleDelete = async (dealId: string) => {
    if (!confirm("Are you sure you want to delete this deal?")) return;
    try {
      await api.deleteDeal(dealId);
      fetchDeals();
    } catch (error) {
      console.error("Failed to delete deal:", error);
    }
  };

  const formatPrice = (value: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Number(value));
  };

  const DealCard = ({ deal }: { deal: Deal }) => {
    const stageConfig = getStageConfig(deal.stage);
    return (
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => { setSelectedDeal(deal); setShowDetail(true); }}
        draggable
        onDragStart={(e) => e.dataTransfer.setData("dealId", deal.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {deal.lead?.name || deal.property?.name || `Deal #${deal.id.slice(0, 8)}`}
          </h4>
          {deal.aiCloseProbability && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Probability</p>
              <p className="text-lg font-bold text-primary">{deal.aiCloseProbability}%</p>
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <Badge variant="secondary" className={cn("text-sm", stageConfig.color)}>
            {stageConfig.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-2">
          <DollarSign className="w-5 h-5" />
          {formatPrice(deal.value)}
        </div>

        {deal.lead && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Lead: {deal.lead.name}</span>
          </div>
        )}

        {deal.property && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Home className="w-3.5 h-3.5" />
            <span>Property: {deal.property.name}</span>
          </div>
        )}

        {deal.expectedCloseDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Expected: {new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-400">
            {new Date(deal.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  };

  const PipelineColumn = ({ stage, label, color, deals: columnDeals }: { 
    stage: string; 
    label: string; 
    color: string; 
    deals: Deal[]; 
  }) => {
    const totalValue = columnDeals.reduce((sum, d) => sum + Number(d.value), 0);
    return (
      <div className="flex flex-col min-w-[300px] max-w-[300px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", color)} />
            <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
            <Badge variant="secondary" className={cn(color, "text-xs")}>
              {columnDeals.length}
            </Badge>
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatPrice(totalValue.toString())}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px] bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-2" 
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => {
               e.preventDefault();
               const dealId = e.dataTransfer.getData("dealId");
               if (dealId) handleStageChange(dealId, stage);
             }}>
          {columnDeals.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
          {columnDeals.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop deals here
            </div>
          )}
        </div>
      </div>
    );
  };

  const totalPipelineValue = deals.reduce((sum, d) => sum + Number(d.value), 0);
  const wonValue = deals.filter(d => d.stage === "CLOSED_WON").reduce((sum, d) => sum + Number(d.value), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Deals Pipeline</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track deals through your sales pipeline</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search deals..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-10"
            />
          </div>
          <Select value={stageFilter} onValueChange={(v) => { setStageFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Stages</SelectItem>
              {DEAL_STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pipeline</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(totalPipelineValue.toString())}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Won Deals</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(wonValue.toString())}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Deals</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{deals.filter(d => !["CLOSED_WON", "CLOSED_LOST"].includes(d.stage)).length}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Kanban */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {groupedDeals.map(column => (
            <PipelineColumn key={column.stage} {...column} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} deals
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

      {/* Deal Detail Modal */}
      {showDetail && selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedDeal.lead?.name || selectedDeal.property?.name || `Deal #${selectedDeal.id.slice(0, 8)}`}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => { setShowDetail(false); setSelectedDeal(null); }}>
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Deal Value</label>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatPrice(selectedDeal.value)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stage</label>
                  <Badge variant="secondary" className={cn(getStageConfig(selectedDeal.stage).color, "mt-1")}>
                    {getStageConfig(selectedDeal.stage).label}
                  </Badge>
                </div>
                {selectedDeal.lead && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lead</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedDeal.lead.name} ({selectedDeal.lead.email})</p>
                  </div>
                )}
                {selectedDeal.property && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Property</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedDeal.property.name} - {selectedDeal.property.location}</p>
                  </div>
                )}
                {selectedDeal.expectedCloseDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Close</label>
                    <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedDeal.expectedCloseDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedDeal.closedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Closed At</label>
                    <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedDeal.closedAt).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedDeal.aiCloseProbability && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Close Probability</label>
                    <p className="text-2xl font-bold text-primary mt-1">{selectedDeal.aiCloseProbability}%</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => { setShowDetail(false); setSelectedDeal(null); }}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => { /* edit */ }}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => { handleDelete(selectedDeal.id); setShowDetail(false); setSelectedDeal(null); }}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      )}

      {/* Create Deal Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="p-6 border-b">
              <CardTitle className="text-xl">Create New Deal</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <CreateDealForm onClose={() => setShowCreate(false)} onSuccess={fetchDeals} />
            </CardContent>
          </div>
        </div>
      )}

      {isLoading && deals.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

function CreateDealForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    value: "", stage: "PROSPECTING", leadId: "", propertyId: "", expectedCloseDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createDeal({
        ...formData,
        value: String(formData.value),
        stage: formData.stage,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Deal Value *</label>
        <Input type="number" required value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="500000" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Stage</label>
        <Select value={formData.stage} onValueChange={v => setFormData({...formData, stage: v})}>
          <SelectTrigger><SelectValue placeholder="Select stage" /></SelectTrigger>
          <SelectContent>
            {DEAL_STAGES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Lead ID</label>
        <Input value={formData.leadId} onChange={e => setFormData({...formData, leadId: e.target.value})} placeholder="Lead UUID" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Property ID</label>
        <Input value={formData.propertyId} onChange={e => setFormData({...formData, propertyId: e.target.value})} placeholder="Property UUID (optional)" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Expected Close Date</label>
        <Input type="date" value={formData.expectedCloseDate} onChange={e => setFormData({...formData, expectedCloseDate: e.target.value})} />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}