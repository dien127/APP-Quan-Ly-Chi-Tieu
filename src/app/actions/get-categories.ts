"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;

  const categories = await prisma.category.findMany({
    where: { 
      userId,
      isDeleted: false
    },
    orderBy: { name: "asc" },
  });

  return categories;
}
