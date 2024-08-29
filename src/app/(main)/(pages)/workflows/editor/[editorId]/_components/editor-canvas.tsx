'use client';
import {
  Actions,
  CronjobConfigType,
  Cronjobs,
  EditorCanvasCardType,
  EditorCanvasTypes,
  EditorNodeType,
  Triggers,
} from '@/lib/types';
import { useEditor } from '@/providers/editor-provider';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
  ReactFlowInstance,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  BackgroundVariant,
  Node,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import EditorCanvasCardSingle from './editor-canvas-card-single';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { EditorCanvasDefaultCardTypes } from '@/lib/constant';
import FlowInstance from './flow-instance';
import EditorCanvasSidebar from './editor-canvas-sidebar';
import {
  onGetNodesEdges,
  onSaveCronjob,
} from '../../../_actions/workflow-connections';
import { v4 } from 'uuid';
import Spinner from '@/components/icons/spinner';
import { Workflows } from '@prisma/client';
import CronjobForm from '@/components/forms/cronjob-form';
import SolanaWalletForm from '@/components/forms/solana-wallet-form';

type Props = {
  workflow: Workflows;
};

const initialNodes: EditorNodeType[] = [];

const initialEdges: { id: string; source: string; target: string }[] = [];

const EditorCanvas = ({ workflow }: Props) => {
  const { dispatch, state } = useEditor();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isWorkFlowLoading, setIsWorkFlowLoading] = useState<boolean>(false);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>();
  const pathname = usePathname();

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // @ts-expect-error TODO: Fix typing here
      setNodes((nds) => {
        return applyNodeChanges(changes, nds);
      });
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type: EditorCanvasCardType['type'] = event.dataTransfer.getData(
        'application/reactflow'
      );

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const triggerAlreadyExists = state.editor.elements.find(
        (node) => node.type === Triggers.Trigger
      );

      if (type === Triggers.Trigger && triggerAlreadyExists) {
        toast('Only one trigger can be added to automations at the moment');
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      if (!reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: EditorNodeType = {
        id: v4(),
        type,
        position,
        data: {
          title: type,
          description: EditorCanvasDefaultCardTypes[type].description,
          completed: false,
          current: false,
          metadata: {},
          type: type,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, state]
  );

  const handleClickCanvas = () => {
    dispatch({
      type: 'SELECTED_ELEMENT',
      payload: {
        element: {
          data: {
            completed: false,
            current: false,
            description: '',
            metadata: {},
            title: '',
            type: Triggers.Trigger,
          },
          id: '',
          position: { x: 0, y: 0 },
          type: Triggers.Trigger,
        },
      },
    });
  };

  useEffect(() => {
    dispatch({ type: 'LOAD_DATA', payload: { edges, elements: nodes } });
  }, [nodes, edges]);

  const CronjobCanvasCard = ({ data }: NodeProps) => {
    return (
      <EditorCanvasCardSingle
        data={data}
        popoverContent={
          <CronjobForm
            workflow={workflow}
            onUpdate={async (cronjobConfig: CronjobConfigType) => {
              onSaveCronjob(workflow.id, cronjobConfig);
              toast.message('Cronjob template saved');
            }}
          />
        }
      />
    );
  };

  const SolanaWalletBalanceCanvasCard = ({ data }: NodeProps) => {
    return (
      <EditorCanvasCardSingle
        data={data}
        popoverContent={
          <SolanaWalletForm
            walletAddress=""
            onUpdate={async (newAddress: string) => {
              console.log('newAddress: ', newAddress);
            }}
          />
        }
      />
    );
  };

  const nodeTypes = useMemo(
    () => ({
      [Cronjobs.Cronjob]: CronjobCanvasCard,
      [Triggers.Trigger]: EditorCanvasCardSingle,
      [Actions.SolanaWalletBalance]: SolanaWalletBalanceCanvasCard,
      // [Actions.TransferSol]: SolanaWalletBalanceCanvasCard,
      [Actions.Action]: EditorCanvasCardSingle,
      [Actions.Email]: EditorCanvasCardSingle,
      [Actions.Condition]: EditorCanvasCardSingle,
      [Actions.AI]: EditorCanvasCardSingle,
      [Actions.Slack]: EditorCanvasCardSingle,
      [Actions.Notion]: EditorCanvasCardSingle,
      [Actions.Discord]: EditorCanvasCardSingle,
      [Actions.CustomWebhook]: EditorCanvasCardSingle,
      [Actions.GoogleCalendar]: EditorCanvasCardSingle,
      [Actions.Wait]: EditorCanvasCardSingle,
      // 'Google Drive': EditorCanvasCardSingle,
    }),
    []
  );

  const onGetWorkFlow = async () => {
    setIsWorkFlowLoading(true);
    const response = await onGetNodesEdges(pathname.split('/').pop()!);
    if (response) {
      setEdges(JSON.parse(response.edges!));
      setNodes(JSON.parse(response.nodes!));
      setIsWorkFlowLoading(false);
    }
    setIsWorkFlowLoading(false);
  };

  const onNodesDelete = useCallback(
    (nodes: Node[]) => {
      console.log('DELETED NODE: ', nodes);
    },
    [nodes]
  );

  useEffect(() => {
    onGetWorkFlow();
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center">
          <div
            style={{ width: '100%', height: '100%', paddingBottom: '70px' }}
            className="relative"
          >
            {isWorkFlowLoading ? (
              <div className="absolute flex h-full w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <ReactFlow
                className="w-[300px]"
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodes={state.editor.elements}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                fitView
                onClick={handleClickCanvas}
                nodeTypes={nodeTypes}
                onNodesDelete={onNodesDelete}
              >
                <Controls position="top-left" />
                <MiniMap
                  position="bottom-left"
                  className="!bg-background"
                  zoomable
                  pannable
                />
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={12}
                  size={1}
                />
              </ReactFlow>
            )}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40} className="relative sm:block">
        {isWorkFlowLoading ? (
          <div className="absolute flex h-full w-full items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <FlowInstance
            edges={edges}
            nodes={nodes}
            isPublished={workflow.publish || false}
            workflowId={workflow.id}
          >
            <EditorCanvasSidebar nodes={nodes} workflow={workflow} />
          </FlowInstance>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EditorCanvas;
