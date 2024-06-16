"use server";
import prisma from "@/lib/prisma";
import { createCollectionSchemaType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs/server";

export async function createCollection(form: createCollectionSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error("no user found");
  }

  return await prisma.collection.create({
    data: {
      userId: user.id,
      color: form.color,
      name: form.name,
    },
  });
}
