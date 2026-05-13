"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(data: {
  name?: string;
  phone?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  revalidatePath("/dashboard/settings");
  return user;
}

export async function getUserSettings() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phone: true,
      telegramBotToken: true,
      telegramChatId: true,
    },
  });
}
