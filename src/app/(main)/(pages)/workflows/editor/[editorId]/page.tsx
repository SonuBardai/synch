import { ConnectionsProvider } from '@/providers/connections-provider';
import EditorProvider from '@/providers/editor-provider';
import React from 'react';
import EditorCanvas from './_components/editor-canvas';
import { db } from '@/lib/db';
import { Toaster } from 'sonner';

const Page = async ({ params }: { params: { editorId: string } }) => {
  const { editorId } = params;
  if (Array.isArray(editorId)) {
    throw new Error('Invalid editor ID');
  }
  const workflow = await db.workflows.findFirst({
    where: {
      id: editorId,
    },
  });
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  return (
    <div className="h-full">
      <EditorProvider>
        <ConnectionsProvider>
          <EditorCanvas workflow={workflow} />
          <Toaster />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  );
};

export default Page;
