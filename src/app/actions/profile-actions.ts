"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  currency: z.string().min(1),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
});

export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const validated = profileSchema.parse(data);

  await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: validated.fullName,
      email: validated.email,
      avatarUrl: validated.avatarUrl || null,
      currency: validated.currency,
    },
  });

  revalidatePath("/profile");
  revalidatePath("/");
  return { success: true };
}

export async function updatePassword(data: z.infer<typeof passwordSchema>) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");
  const email = session.user.email;

  const validated = passwordSchema.parse(data);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("User not found");

  const isValid = await bcrypt.compare(validated.currentPassword, user.passwordHash);
  if (!isValid) throw new Error("Mật khẩu hiện tại không đúng");

  const hashedPassword = await bcrypt.hash(validated.newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { passwordHash: hashedPassword },
  });

  return { success: true };
}

export async function getCurrencyRates() {
  // Hardcoded rates for demo purposes (Base is VND)
  // In a real app, this would fetch from an external API (like fixer.io or Frankfurter)
  return {
    VND: 1,
    USD: 25450,
    EUR: 27120,
    JPY: 168,
    GBP: 32300,
    AUD: 16850,
    CAD: 18500,
    SGD: 19100,
    CNY: 3520,
    KRW: 18.5,
  };
}
