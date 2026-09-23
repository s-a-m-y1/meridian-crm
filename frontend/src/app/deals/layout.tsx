import DashboardLayout from "../dashboard/layout";

export const dynamic = 'force-dynamic';

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}