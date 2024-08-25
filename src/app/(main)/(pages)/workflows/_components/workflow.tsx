import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import WorkflowActions from './workflow-actions';
import EditorCanvasIconHelper from '../editor/[editorId]/_components/editor-canvas-card-icon-hepler';
import { EditorCanvasTypes, EditorNodeType } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  name: string;
  description: string;
  id: string;
  publish: boolean | null;
  flowPath: string | null;
  nodes: string | null;
};

const Workflow = ({
  description,
  id,
  name,
  publish,
  flowPath,
  nodes,
}: Props) => {
  let parsedFlowPath: string[] = JSON.parse(flowPath!) ?? [];
  const parsedNodes: EditorNodeType[] = JSON.parse(nodes!) ?? [];
  const titles = parsedNodes.map((node) => node.data.title);
  const getPriority = (item: string) =>
    item === 'Cronjob' ? 1 : item === 'Trigger' ? 2 : 3;
  const sortedFlowPath = Array.from(
    new Set([...parsedFlowPath, ...titles])
  ).sort((a, b) => {
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    return priorityA - priorityB;
  });

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex flex-row gap-2">
            {sortedFlowPath.length === 0 ? (
              <span className="text-destructive">[Empty flow]</span>
            ) : (
              sortedFlowPath.map((item, index) => {
                return (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <EditorCanvasIconHelper
                          key={index}
                          type={item as EditorCanvasTypes}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })
            )}
          </div>
          <div className="">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </Link>
      </CardHeader>
      <WorkflowActions
        id={id}
        name={name}
        description={description}
        publish={publish}
      />
    </Card>
  );
};

export default Workflow;
