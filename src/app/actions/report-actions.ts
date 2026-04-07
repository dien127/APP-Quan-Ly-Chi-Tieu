"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import * as XLSX from "xlsx";

export async function exportTransactionsToExcel() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    // 1. Fetch transactions with relations
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      include: {
        wallet: true,
        toWallet: true,
        category: true,
      },
      orderBy: { date: "desc" },
    });

    // 2. Format data for Excel
    const data = transactions.map((t) => ({
      "Ngày": new Date(t.date).toLocaleDateString("vi-VN"),
      "Loại": t.type === "INCOME" ? "Thu nhập" : t.type === "EXPENSE" ? "Chi tiêu" : "Chuyển tiền",
      "Danh mục": t.category?.name || (t.type === "TRANSFER" ? "Chuyển khoản" : "N/A"),
      "Ví/Nguồn": t.wallet.name,
      "Đến ví": t.toWallet?.name || "",
      "Số tiền": Number(t.amount),
      "Ghi chú": t.note || "",
    }));

    // 3. Create Workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Set column widths
    const wscols = [
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
    ];
    worksheet["!cols"] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Giao dịch");

    // 4. Generate Base64 string
    const buffer = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });

    return { success: true, data: buffer };
  } catch (error) {
    if (error instanceof Error) console.error("Export Error:", error.message);
    return { success: false, error: "Không thể xuất file Excel" };
  }
}

export async function getCashFlowTrend() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: sixMonthsAgo },
      },
      orderBy: { date: "asc" },
    });

    // Group by month and calculate Income vs Expense
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        key: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`,
        label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`,
        income: 0,
        expense: 0,
      };
    });

    transactions.forEach((t) => {
      const monthKey = `${new Date(t.date).getFullYear()}-${(new Date(t.date).getMonth() + 1).toString().padStart(2, "0")}`;
      const month = months.find((m) => m.key === monthKey);
      if (month) {
        if (t.type === "INCOME") month.income += Number(t.amount);
        if (t.type === "EXPENSE") month.expense += Number(t.amount);
      }
    });

    return { success: true, data: months };
  } catch (error) {
    if (error instanceof Error) console.error("Trend Error:", error.message);
    return { success: false, error: "Lỗi tải biểu đồ xu hướng" };
  }
}
