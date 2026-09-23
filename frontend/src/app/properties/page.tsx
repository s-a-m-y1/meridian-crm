"use client";

import { PropertiesTable } from "@/components/properties/PropertiesTable";

export const dynamic = 'force-dynamic';

export default function PropertiesPage() {
  return (
    <div className="p-6 space-y-6">
      <PropertiesTable />
    </div>
  );
}