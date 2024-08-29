import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return Response.json({ message: 'User not found' }, { status: 401 });
  }

  const body = await req.json();
  const { publicKey } = body;

  if (!publicKey) {
    return Response.json(
      { message: 'Public key is required' },
      { status: 400 }
    );
  }

  try {
    // TODO: fetch wallet balance
    const existingWallet = await db.solWallet.findFirst({
      where: {
        address: publicKey,
      },
    });
    if (existingWallet) {
      if (existingWallet.userId === user.id) {
        return Response.json(
          { message: 'Wallet already connected' },
          { status: 200 }
        );
      } else {
        return Response.json(
          { message: 'Wallet already connected' },
          { status: 400 }
        );
      }
    }
    const solWallet = await db.solWallet.create({
      data: {
        userId: user.id,
        address: publicKey,
        balance: 0,
      },
    });
    await db.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        solWalletId: solWallet.id,
      },
    });

    return Response.json({ message: 'Public key saved successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
