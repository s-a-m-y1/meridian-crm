"use client";

import { CustomersTable } from "@/components/customers/CustomersTable";

export const dynamic = 'force-dynamic';

export default function CustomersPage() {
  return (
    <div className="p-6 space-y-6">
      <CustomersTable />
    </div>
  );
}