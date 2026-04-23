"use client";
import { Shell } from "@/components/layout/shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function Page() {
  return (
    <Shell title="alerts" subtitle="Coming in Phase 2">
      <EmptyState variant="no-data" title="Coming in Phase 2" description="Halaman ini akan dibangun pada Phase 2 sesuai blueprint Sentinel." />
    </Shell>
  );
}
