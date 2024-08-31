'use client';
import { Button } from '@/components/ui/button';
import { useNodeConnections } from '@/providers/connections-provider';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { onCreateNodesEdges } from '../_actions/workflow-connections';
import { toast } from 'sonner';
import { onFlowPublish } from '@/actions/workflow-actions';
import { FaPlay, FaSpinner } from 'react-icons/fa6';
import axios from 'axios';
import { Switch } from '@/components/ui/switch';

type Props = {
  children: React.ReactNode;
  edges: any[];
  nodes: any[];
  isPublished: boolean;
  workflowId: string;
};

const FlowInstance = ({
  children,
  edges,
  nodes,
  isPublished,
  workflowId,
}: Props) => {
  const pathname = usePathname();
  const [isFlow, setIsFlow] = useState([]);
  const { nodeConnection } = useNodeConnections();
  const [loadingTestRun, setLoadingTestRun] = useState(false);

  const onFlowAutomation = useCallback(async () => {
    const flow = await onCreateNodesEdges(
      pathname.split('/').pop()!,
      JSON.stringify(nodes),
      JSON.stringify(edges),
      JSON.stringify(isFlow)
    );

    if (flow) toast.message(flow.message);
  }, [nodeConnection, edges, nodes]);

  const onPublishWorkflow = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      const response = await onFlowPublish(
        pathname.split('/').pop()!,
        // @ts-expect-error ariachecked does exist in a switch
        event.target.ariaChecked === 'false'
      );
      if (response) toast.message(response);
    },
    []
  );

  const onAutomateFlow = async () => {
    const flows: any = [];
    const connectedEdges = edges.map((edge) => edge.target);
    connectedEdges.map((target) => {
      nodes.map((node) => {
        if (node.id === target) {
          flows.push(node.type);
        }
      });
    });

    setIsFlow(flows);
  };

  const onRunWorkflow = async () => {
    setLoadingTestRun(true);
    try {
      const response = await axios.post('/api/workflow/run', {
        workflow_id: workflowId,
      });

      // Handle the response (optional)
      if (response.status === 200) {
        console.log('Workflow executed successfully:', response.data);
        toast.message('Workflow executed successfully');
      } else {
        toast.error(`Error executing workflow: ${response.data.message}`);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || JSON.stringify(error);
      toast.error(`Error executing workflow: ${errorMessage}`);
    } finally {
      setLoadingTestRun(false);
    }
  };

  useEffect(() => {
    onAutomateFlow();
  }, [edges]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-3">
          <Button
            onClick={onFlowAutomation}
            disabled={(isFlow?.length ?? 0) < 1}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            onClick={onRunWorkflow}
            disabled={loadingTestRun}
          >
            <div>
              {loadingTestRun ? (
                <FaSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex gap-2 items-center">
                  <FaPlay />
                  <span>Test Run</span>
                </span>
              )}
            </div>
          </Button>
        </div>
        <div className="flex gap-3">
          <span>Publish</span>
          <Switch
            id="airplane-mode"
            onClick={onPublishWorkflow}
            defaultChecked={isPublished!}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default FlowInstance;
