"use client";

import { LeadsKanban } from "@/components/leads/LeadsKanban";

export const dynamic = 'force-dynamic';

export default function LeadsPage() {
  return (
    <div className="p-6 space-y-6">
      <LeadsKanban />
    </div>
  );
}