"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WalletOption {
  id: string;
  name: string;
}

export function TransactionFilters({ 
  wallets, 
  currentType, 
  currentWalletId 
}: { 
  wallets: WalletOption[], 
  currentType: string, 
  currentWalletId: string 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`/transactions?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-[150px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase">Loại giao dịch</label>
        <Select defaultValue={currentType || "ALL"} onValueChange={(v) => updateFilters("type", v || "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả loại</SelectItem>
            <SelectItem value="INCOME">Thu nhập</SelectItem>
            <SelectItem value="EXPENSE">Chi tiêu</SelectItem>
            <SelectItem value="TRANSFER">Chuyển khoản</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[200px] space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground uppercase">Ví tài khoản</label>
        <Select defaultValue={currentWalletId || "ALL"} onValueChange={(v) => updateFilters("walletId", v || "ALL")}>
          <SelectTrigger>
            <SelectValue placeholder="Tất cả ví" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả ví</SelectItem>
            {wallets.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
