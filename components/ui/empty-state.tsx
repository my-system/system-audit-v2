import { cn } from "@/lib/utils";
import { CheckCircle2, SearchX, UploadCloud, AlertCircle } from "lucide-react";

type EmptyVariant = "no-alerts" | "no-data" | "upload" | "error" | "no-results";

const variants = {
  "no-alerts": {
    icon: CheckCircle2,
    title: "Tidak Ada Alert Hari Ini 🎉",
    desc: "Sistem berjalan normal. Tidak ada transaksi mencurigakan terdeteksi.",
    color: "text-emerald-400",
  },
  "no-data": {
    icon: UploadCloud,
    title: "Belum Ada Data",
    desc: "Upload data CSV untuk memulai analisis fraud detection.",
    color: "text-cyan-400",
  },
  "upload": {
    icon: UploadCloud,
    title: "Drag & Drop File Anda",
    desc: "Mendukung format CSV dan XLSX hingga 50MB.",
    color: "text-cyan-400",
  },
  "error": {
    icon: AlertCircle,
    title: "Terjadi Kesalahan",
    desc: "Gagal memuat data. Silakan refresh halaman atau hubungi admin.",
    color: "text-red-400",
  },
  "no-results": {
    icon: SearchX,
    title: "Tidak Ada Hasil",
    desc: "Tidak ada data yang cocok dengan filter yang Anda pilih.",
    color: "text-slate-400",
  },
};

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ variant = "no-data", title, description, action, className }: EmptyStateProps) {
  const v = variants[variant];
  const Icon = v.icon;
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
        "bg-[#1a2235] border border-[#1e2d45]"
      )}>
        <Icon className={cn("w-8 h-8", v.color)} />
      </div>
      <h3 className="text-base font-semibold text-[#e2e8f0] mb-2">{title ?? v.title}</h3>
      <p className="text-sm text-[#64748b] max-w-xs">{description ?? v.desc}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
