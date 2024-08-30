import { ConnectionsProvider } from '@/providers/connections-provider';
import EditorProvider from '@/providers/editor-provider';
import React from 'react';
import EditorCanvas from './_components/editor-canvas';
import { db } from '@/lib/db';
import { Toaster } from 'sonner';
import { currentUser } from '@clerk/nextjs/server';

const Page = async ({ params }: { params: { editorId: string } }) => {
  const { editorId } = params;
  if (!editorId || Array.isArray(editorId)) {
    throw new Error('Invalid editor ID');
  }
  let workflow = null;
  try {
    workflow = await db.workflows.findFirst({
      where: {
        id: editorId,
      },
    });
  } catch (err) {
    console.log(err);
  }
  if (!workflow) {
    throw new Error('Workflow not found');
  }
  const clerkUser = await currentUser();
  const user = await db.user.findFirst({
    where: {
      clerkId: clerkUser?.id,
    },
    include: {
      solWallet: true,
    },
  });

  return (
    <div className="h-full">
      <EditorProvider>
        <ConnectionsProvider>
          <EditorCanvas workflow={workflow} user={user!} />
          <Toaster />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  );
};

export default Page;
