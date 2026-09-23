"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Loader2, TrendingUp, AlertTriangle, Target, DollarSign, Users, Clock, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";

interface BriefingData {
  summary?: {
    newLeads?: number;
    activeDeals?: number;
    tasksDue?: number;
    overdueTasks?: number;
    meetingsToday?: number;
  };
  priorities?: Array<{
    type?: string;
    title?: string;
    reason?: string;
    action?: string;
    time?: string;
  }>;
  opportunities?: Array<{
    lead?: string;
    action?: string;
    probability?: number;
  }>;
  risks?: Array<{
    lead?: string;
    risk?: string;
    mitigation?: string;
  }>;
  generatedAt?: string;
}

interface NeglectedLead {
  leadId: string;
  leadName: string;
  daysSinceActivity: number;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  recommendedAction: string;
}

// Reuse the app-wide Badge variants so the same color means the same thing
// everywhere in the product (#21).
type BadgeVariant = "HOT" | "WARM" | "success" | "secondary";

function priorityVariant(type?: string): BadgeVariant {
  switch (type) {
    case "URGENT":
    case "HIGH":
      return "HOT";
    case "MEDIUM":
      return "WARM";
    default:
      return "secondary";
  }
}

function riskVariant(level?: string): BadgeVariant {
  switch (level) {
    case "HIGH":
      return "HOT";
    case "MEDIUM":
      return "WARM";
    default:
      return "success";
  }
}

export function AIInsightsPanel() {
  const [briefing, setBriefing] = useState<BriefingData | null>(null);
  const [neglectedLeads, setNeglectedLeads] = useState<NeglectedLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const [briefingRes, neglectedRes] = await Promise.all([
        api.aiGetBriefing(),
        api.aiGetNeglectedLeads(14),
      ]);

      // Backend returns { briefing: {...}, date } — unwrap safely
      const data = briefingRes.data?.briefing ?? briefingRes.data ?? null;
      setBriefing(data);

      const neglected =
        neglectedRes.data?.neglectedLeads ?? neglectedRes.data ?? [];
      setNeglectedLeads(Array.isArray(neglected) ? neglected : []);
    } catch (error) {
      console.error("Failed to load AI insights:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-red-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Failed to load insights
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please try again.
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={loadInsights}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = briefing?.summary;
  const priorities = briefing?.priorities ?? [];
  const opportunities = briefing?.opportunities ?? [];
  const risks = briefing?.risks ?? [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Summary tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">New Leads</span>
            </div>
            <p className="text-2xl font-bold">{summary?.newLeads ?? 0}</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Active Deals</span>
            </div>
            <p className="text-2xl font-bold">{summary?.activeDeals ?? 0}</p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Tasks Due</span>
            </div>
            <p className="text-2xl font-bold">{summary?.tasksDue ?? 0}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <p className="text-2xl font-bold">{summary?.overdueTasks ?? 0}</p>
          </div>
        </div>

        {/* Top Priorities — top 3, no inner scrollbar */}
        {priorities.length > 0 && (
          <div className="min-w-0">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Priorities
            </h4>
            <div className="space-y-2">
              {priorities.slice(0, 3).map((priority, idx) => (
                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-primary min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={priorityVariant(priority.type)} className="text-xs">
                      {priority.type}
                    </Badge>
                    <span className="text-sm font-medium break-words min-w-0 flex-1">
                      {priority.title}
                    </span>
                  </div>
                  {priority.reason && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-words">
                      {priority.reason}
                    </p>
                  )}
                  {priority.action && (
                    <p className="text-sm text-primary mt-1 break-words">{priority.action}</p>
                  )}
                  {priority.time && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {priority.time}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities — top 3, no inner scrollbar */}
        {opportunities.length > 0 && (
          <div className="min-w-0">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Opportunities
            </h4>
            <div className="space-y-2">
              {opportunities.slice(0, 3).map((opp, idx) => (
                <div key={idx} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{opp.lead}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{opp.action}</p>
                    </div>
                    <Badge variant="success" className="text-xs whitespace-nowrap">
                      {opp.probability}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks — top 3, no inner scrollbar */}
        {risks.length > 0 && (
          <div className="min-w-0">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Risks
            </h4>
            <div className="space-y-2">
              {risks.slice(0, 3).map((risk, idx) => (
                <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg min-w-0">
                  <p className="text-sm font-medium break-words">{risk.lead}</p>
                  <p className="text-sm text-red-600 dark:text-red-400 break-words">{risk.risk}</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1 break-words">
                    {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neglected Leads — top 3, no inner scrollbar */}
        {neglectedLeads.length > 0 && (
          <div className="min-w-0">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Neglected Leads
            </h4>
            <div className="space-y-2">
              {neglectedLeads.slice(0, 3).map((lead, idx) => (
                <div key={idx} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{lead.leadName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lead.daysSinceActivity} days since activity
                      </p>
                    </div>
                    <Badge variant={riskVariant(lead.riskLevel)} className="text-xs whitespace-nowrap">
                      {lead.riskLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!briefing && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No insights available yet</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={loadInsights}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
