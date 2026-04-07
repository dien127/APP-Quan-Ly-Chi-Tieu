"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  type: z.enum(["INCOME", "EXPENSE"]),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export async function createCategory(data: z.infer<typeof categorySchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = categorySchema.parse(data);

    await prisma.category.create({
      data: {
        ...validatedData,
        userId,
      },
    });

    revalidatePath("/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function updateCategory(id: string, data: z.infer<typeof categorySchema>) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    const validatedData = categorySchema.parse(data);

    await prisma.category.update({
      where: { id, userId },
      data: validatedData,
    });

    revalidatePath("/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");
    const userId = session.user.id;

    // Áp dụng cơ chế Soft Delete (is_deleted) như thiết kế trong Schema
    await prisma.category.update({
      where: { id, userId },
      data: { isDeleted: true },
    });

    revalidatePath("/categories");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Đã xảy ra lỗi" };
  }
}
