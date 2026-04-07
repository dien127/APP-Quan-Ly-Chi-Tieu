"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const walletSchema = z.object({
  name: z.string().min(1, "Tên ví không được để trống"),
  balance: z.number().default(0),
  icon: z.string().optional(),
});

export async function createWallet(data: z.infer<typeof walletSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = walletSchema.parse(data);

    await prisma.wallet.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath("/wallets");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function updateWallet(id: string, data: z.infer<typeof walletSchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = walletSchema.parse(data);

    await prisma.wallet.update({
      where: { id, userId },
      data: validatedData,
    });

    revalidatePath("/wallets");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function deleteWallet(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Ràng buộc: Không cho xóa ví nếu có giao dịch liên kết
    const transactionCount = await prisma.transaction.count({
      where: {
        OR: [
          { walletId: id },
          { toWalletId: id }
        ]
      }
    });

    if (transactionCount > 0) {
      throw new Error("Không thể xóa ví đã có giao dịch. Hãy xóa các giao dịch trước.");
    }

    await prisma.wallet.delete({
      where: { id, userId },
    });

    revalidatePath("/wallets");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}
