"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Command, 
  CommandInput, 
  CommandList, 
  CommandGroup, 
  CommandItem, 
  CommandEmpty 
} from "@/components/ui/Command";
import { Search, X, ChevronRight, Users, Target, Home, DollarSign, CheckSquare, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface SearchResult {
  id: string;
  type: "lead" | "customer" | "property" | "deal" | "task";
  title: string;
  subtitle: string;
  url: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const allResults: SearchResult[] = [];

      // Search leads
      try {
        const leadsRes = await api.getLeads({ search: searchQuery, limit: 5 });
        leadsRes.data.data?.forEach((lead: any) => {
          allResults.push({
            id: lead.id,
            type: "lead",
            title: lead.name,
            subtitle: `Lead • ${lead.status} • ${lead.email || "No email"}`,
            url: `/leads/${lead.id}`,
          });
        });
      } catch (e) {}

      // Search customers
      try {
        const customersRes = await api.getCustomers({ search: searchQuery, limit: 5 });
        customersRes.data.data?.forEach((customer: any) => {
          allResults.push({
            id: customer.id,
            type: "customer",
            title: customer.name,
            subtitle: `Customer • ${customer.email || "No email"}`,
            url: `/customers/${customer.id}`,
          });
        });
      } catch (e) {}

      // Search properties
      try {
        const propertiesRes = await api.getProperties({ search: searchQuery, limit: 5 });
        propertiesRes.data.data?.forEach((property: any) => {
          allResults.push({
            id: property.id,
            type: "property",
            title: property.name,
            subtitle: `Property • ${property.category} • ${property.location}`,
            url: `/properties/${property.id}`,
          });
        });
      } catch (e) {}

      // Search deals
      try {
        const dealsRes = await api.getDeals({ search: searchQuery, limit: 5 });
        dealsRes.data.data?.forEach((deal: any) => {
          allResults.push({
            id: deal.id,
            type: "deal",
            title: deal.lead?.name || deal.property?.name || `Deal ${deal.id.slice(0, 8)}`,
            subtitle: `Deal • ${deal.stage} • $${Number(deal.value).toLocaleString()}`,
            url: `/deals/${deal.id}`,
          });
        });
      } catch (e) {}

      // Search tasks
      try {
        const tasksRes = await api.getTasks({ search: searchQuery, limit: 5 });
        tasksRes.data.data?.forEach((task: any) => {
          allResults.push({
            id: task.id,
            type: "task",
            title: task.title,
            subtitle: `Task • ${task.status} • ${task.dueAt ? new Date(task.dueAt).toLocaleDateString() : "No due date"}`,
            url: `/tasks/${task.id}`,
          });
        });
      } catch (e) {}

      setResults(allResults.slice(0, 20));
      setSelectedIndex(0);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(0);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].url;
          setOpen(false);
          setQuery("");
        }
        break;
      case "Escape":
        setOpen(false);
        setQuery("");
        break;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const getIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "lead": return <Target className="w-4 h-4 text-blue-500" />;
      case "customer": return <Users className="w-4 h-4 text-green-500" />;
      case "property": return <Home className="w-4 h-4 text-purple-500" />;
      case "deal": return <DollarSign className="w-4 h-4 text-yellow-500" />;
      case "task": return <CheckSquare className="w-4 h-4 text-orange-500" />;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Command open={open} onOpenChange={setOpen}>
      <div className="flex flex-col h-[400px]">
        <div className="relative flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
          <Search className="absolute left-4 w-5 h-5 text-gray-400" />
          <CommandInput
            ref={inputRef}
            placeholder="Search leads, customers, properties, deals, tasks... (⌘K)"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); setResults([]); setSelectedIndex(0); inputRef.current?.focus(); }}
              className="absolute right-4 w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <CommandList className="flex-1 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <>
              <CommandGroup>
                {results.map((result, index) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => {
                      window.location.href = result.url;
                      setOpen(false);
                      setQuery("");
                    }}
                    data-selected={index === selectedIndex}
                  >
                    {getIcon(result.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{result.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.subtitle}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                      {getTypeLabel(result.type)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : query.length >= 2 ? (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          ) : query.length > 0 ? (
            <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
          ) : (
            <CommandEmpty>
              Press <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">⌘K</kbd> to search anywhere
            </CommandEmpty>
          )}
        </CommandList>
      </div>
    </Command>
  );
}