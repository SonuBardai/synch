'use server';

import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { Connections, SolWallet, User } from '@prisma/client';

export type UserType = User & {
  solWallet: SolWallet | null;
  connections: Connections[];
};

export const getUser = async (): Promise<UserType | null> => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    include: {
      solWallet: true,
      connections: true,
    },
  });
  return user;
};
