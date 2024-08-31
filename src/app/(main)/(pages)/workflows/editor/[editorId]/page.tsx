import { ConnectionsProvider } from '@/providers/connections-provider';
import EditorProvider from '@/providers/editor-provider';
import React from 'react';
import EditorCanvas from './_components/editor-canvas';
import { Toaster } from 'sonner';

const Page = async () => {
  return (
    <div className="h-full">
      <EditorProvider>
        <ConnectionsProvider>
          <EditorCanvas />
          <Toaster />
        </ConnectionsProvider>
      </EditorProvider>
    </div>
  );
};

export default Page;
