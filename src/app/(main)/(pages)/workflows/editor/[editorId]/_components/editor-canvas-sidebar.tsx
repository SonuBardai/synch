'use client';

import {
  CronjobConfigType,
  EditorCanvasTypes,
  EditorNodeType,
} from '@/lib/types';
import { useNodeConnections } from '@/providers/connections-provider';
import { useEditor } from '@/providers/editor-provider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { CONNECTIONS, EditorCanvasDefaultCardTypes } from '@/lib/constant';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  fetchBotSlackChannels,
  onConnections,
  onDragStart,
} from '@/lib/editor-utils';
import EditorCanvasIconHelper from './editor-canvas-card-icon-hepler';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import RenderConnectionAccordion from './render-connection-accordion';
import RenderOutputAccordion from './render-output-accordian';
import { useFuzzieStore } from '@/store';
import { Workflows } from '@prisma/client';
import CronjobForm from '@/components/forms/cronjob-form';
import { onSaveCronjob } from '../../../_actions/workflow-connections';

type Props = {
  nodes: EditorNodeType[];
  workflow: Workflows;
};

type TabOptions = 'actions' | 'configure' | 'settings';

const EditorCanvasSidebar = ({ nodes, workflow }: Props) => {
  const { state } = useEditor();
  const { nodeConnection } = useNodeConnections();
  const { googleFile, setSlackChannels } = useFuzzieStore();

  const hasConfigureOption = () => {
    return ['Cronjob'].includes(state.editor.selectedNode.data.type);
  };

  const [tab, setTab] = useState<TabOptions>('actions');
  useEffect(() => {
    hasConfigureOption() ? setTab('configure') : setTab('actions');
  }, [state.editor.selectedNode]);

  useEffect(() => {
    if (state) {
      onConnections(nodeConnection, state, googleFile);
    }
  }, [state]);

  useEffect(() => {
    if (nodeConnection.slackNode.slackAccessToken) {
      fetchBotSlackChannels(
        nodeConnection.slackNode.slackAccessToken,
        setSlackChannels
      );
    }
  }, [nodeConnection]);

  return (
    <aside>
      <Tabs
        defaultValue="actions"
        className="h-screen overflow-scroll pb-24"
        value={tab}
        onValueChange={(newtab) => setTab(newtab as TabOptions)}
      >
        <TabsList className="bg-transparent">
          {hasConfigureOption() && (
            <TabsTrigger value="configure">Configure</TabsTrigger>
          )}
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <Separator />
        {hasConfigureOption() && (
          <TabsContent value="configure" className="flex flex-col gap-4 p-4">
            {state.editor.selectedNode.data.type === 'Cronjob' ? (
              <CronjobForm
                workflow={workflow}
                onUpdate={async (cronjobConfig: CronjobConfigType) => {
                  onSaveCronjob(workflow.id, cronjobConfig);
                }}
              />
            ) : null}
          </TabsContent>
        )}
        <TabsContent value="actions" className="flex flex-col gap-4 p-4">
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Trigger') ||
                (nodes.length && cardType.type === 'Action')
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
                onDragStart={(event) => {
                  onDragStart(event, cardKey as EditorCanvasTypes);
                }}
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent value="settings" className="-mt-6">
          <div className="px-2 py-4 text-center text-xl font-bold">
            {state.editor.selectedNode.data.title}
          </div>
          <Accordion type="multiple">
            <AccordionItem value="Options" className="border-y-[1px] px-2">
              <AccordionTrigger className="!no-underline">
                Account
              </AccordionTrigger>
              <AccordionContent>
                {CONNECTIONS.map((connection) => (
                  <RenderConnectionAccordion
                    key={connection.title}
                    state={state}
                    connection={connection}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Expected Output" className="px-2">
              <AccordionTrigger className="!no-underline">
                Action
              </AccordionTrigger>
              <RenderOutputAccordion
                state={state}
                nodeConnection={nodeConnection}
              />
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </aside>
  );
};

export default EditorCanvasSidebar;
