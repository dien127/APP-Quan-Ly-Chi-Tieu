"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const savingGoalSchema = z.object({
  name: z.string().min(1, "Tên mục tiêu không được để trống"),
  targetAmount: z.number().positive("Số tiền mục tiêu phải lớn hơn 0"),
  deadlineDate: z.string().or(z.date()),
  currentAmount: z.number().optional(),
});

export async function createSavingGoal(data: z.infer<typeof savingGoalSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = savingGoalSchema.parse(data);

    await prisma.savingGoal.create({
      data: {
        ...validatedData,
        deadlineDate: new Date(validatedData.deadlineDate),
        userId,
      },
    });

    revalidatePath("/saving-goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function updateSavingGoal(id: string, data: z.infer<typeof savingGoalSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = savingGoalSchema.parse(data);

    await prisma.savingGoal.update({
      where: { id, userId },
      data: {
        ...validatedData,
        deadlineDate: new Date(validatedData.deadlineDate),
      },
    });

    revalidatePath("/saving-goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function deleteSavingGoal(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    await prisma.savingGoal.delete({
      where: { id, userId },
    });

    revalidatePath("/saving-goals");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function addContribution(
  goalId: string, 
  walletId: string, 
  amount: number,
  note?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    if (amount <= 0) throw new Error("Số tiền nạp phải lớn hơn 0");

    await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra ví và số dư
      const wallet = await tx.wallet.findUnique({
        where: { id: walletId, userId },
      });

      if (!wallet) throw new Error("Không tìm thấy ví");
      if (Number(wallet.balance) < amount) {
        throw new Error("Số dư ví không đủ để nạp vào mục tiêu");
      }

      // 2. Trừ tiền ví
      await tx.wallet.update({
        where: { id: walletId },
        data: { balance: { decrement: amount } },
      });

      // 3. Cộng tiền vào mục tiêu
      await tx.savingGoal.update({
        where: { id: goalId },
        data: { currentAmount: { increment: amount } },
      });

      // 4. (Tùy chọn) Ghi lại giao dịch để người dùng theo dõi trong lịch sử chung
      // Mặc định chúng ta coi đây là một khoản "EXPENSE" với note đặc biệt
      await tx.transaction.create({
        data: {
          userId,
          walletId,
          amount,
          type: "EXPENSE",
          date: new Date(),
          note: note || `Nạp tiền vào mục tiêu tiết kiệm`,
        }
      });
    });

    revalidatePath("/saving-goals");
    revalidatePath("/wallets");
    revalidatePath("/transactions");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function getSavingGoals() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];
    const userId = session.user.id;

    const goals = await prisma.savingGoal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return goals;
  } catch (error) {
    console.error("Error fetching saving goals:", error);
    return [];
  }
}
