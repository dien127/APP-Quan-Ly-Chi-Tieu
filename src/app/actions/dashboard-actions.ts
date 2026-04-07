"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { startOfDay, subDays, format } from "date-fns";

export async function getDashboardStats() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30));

  // 1. Dữ liệu Pie Chart: Tổng chi tiêu theo Danh mục
  const spendingByCategory = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: thirtyDaysAgo },
    },
    _sum: {
      amount: true,
    },
  });

  // Lấy thêm thông tin chi tiết danh mục để có Name và Color
  const catIds = spendingByCategory.map(s => s.categoryId).filter((id): id is string => id !== null);
  const categories = await prisma.category.findMany({
    where: { id: { in: catIds } }
  });

  const pieChartData = spendingByCategory.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      name: category?.name || "Khác",
      value: Number(item._sum.amount || 0),
      color: category?.color || "#94a3b8", // Fallback color
    };
  }).filter(item => item.value > 0);

  // 2. Dữ liệu Bar/Line Chart: Thu nhập vs Chi tiêu theo ngày
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: thirtyDaysAgo },
      type: { in: ['INCOME', 'EXPENSE'] },
    },
    orderBy: { date: 'asc' },
  });

  // Nhóm theo ngày
  const dailyData: Record<string, { date: string, income: number, expense: number }> = {};
  
  // Khởi tạo 30 ngày gần nhất với giá trị 0
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(new Date(), i), 'dd/MM');
    dailyData[d] = { date: d, income: 0, expense: 0 };
  }

  transactions.forEach(t => {
    const d = format(new Date(t.date), 'dd/MM');
    if (dailyData[d]) {
      if (t.type === 'INCOME') {
        dailyData[d].income += Number(t.amount);
      } else if (t.type === 'EXPENSE') {
        dailyData[d].expense += Number(t.amount);
      }
    }
  });

  const barChartData = Object.values(dailyData);

  // 3. So sánh tháng này vs tháng trước (MoM)
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [currentExpense, lastExpense] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, date: { gte: startOfCurrentMonth }, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, date: { gte: startOfLastMonth, lte: endOfLastMonth }, type: 'EXPENSE' },
      _sum: { amount: true },
    }),
  ]);

  const currentExpTotal = Number(currentExpense._sum.amount || 0);
  const lastExpTotal = Number(lastExpense._sum.amount || 0);

  let expDiffPercent = 0;
  if (lastExpTotal > 0) {
    expDiffPercent = Math.round(((currentExpTotal - lastExpTotal) / lastExpTotal) * 100);
  }

  return {
    pieChartData,
    barChartData,
    momStats: {
      currentExpTotal,
      lastExpTotal,
      expDiffPercent,
    }
  };
}
