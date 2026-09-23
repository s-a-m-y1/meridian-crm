"use client";

import { DealsPipeline } from "@/components/deals/DealsPipeline";

export const dynamic = 'force-dynamic';

export default function DealsPage() {
  return (
    <div className="p-6 space-y-6">
      <DealsPipeline />
    </div>
  );
}