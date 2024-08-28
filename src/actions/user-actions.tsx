'use server';

import { db } from '@/lib/db';

export const onConnectWallet = async (
  userId: string,
  address: string,
  balance: number
) => {
  try {
    const existingWallet = await db.solWallet.findUnique({
      where: { userId },
    });

    if (existingWallet) {
      const updatedWallet = await db.solWallet.update({
        where: { userId },
        data: { balance },
      });
      return updatedWallet;
    } else {
      const newWallet = await db.solWallet.create({
        data: {
          userId,
          address,
          balance,
        },
      });
      return newWallet;
    }
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw new Error('Failed to connect wallet');
  }
};
