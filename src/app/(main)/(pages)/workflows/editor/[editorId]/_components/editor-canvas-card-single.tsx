import { EditorCanvasCardType, Triggers } from '@/lib/types';
import { useEditor } from '@/providers/editor-provider';
import React, { useMemo, useState } from 'react';
import { Position, useNodeId } from 'reactflow';
import EditorCanvasIconHelper from './editor-canvas-card-icon-hepler';
import CustomHandle from './custom-handle';
import { Badge } from '@/components/ui/badge';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  data: EditorCanvasCardType;
  popoverContent?: React.ReactNode;
  otherDetails?: Array<{
    label: string;
    value: string | number | React.ReactNode;
  }>;
};

const EditorCanvasCardSingle = ({
  data,
  popoverContent,
  otherDetails,
}: Props) => {
  const { dispatch, state } = useEditor();
  const nodeId = useNodeId();
  const logo = useMemo(() => {
    return <EditorCanvasIconHelper type={data.type} />;
  }, [data]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onClick = () => {
    const val = state.editor.elements.find((n) => n.id === nodeId);
    if (val)
      dispatch({
        type: 'SELECTED_ELEMENT',
        payload: {
          element: val,
        },
      });
    if (popoverContent) {
      setIsPopoverOpen(true);
    }
  };

  return (
    <>
      {data.type !== Triggers.Trigger && (
        // data.type !== 'Google Drive' &&
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Card
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="relative max-w-[400px] dark:border-muted-foreground/70"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div>{logo}</div>
              <div>
                <CardTitle className="text-md">{data.title}</CardTitle>
                <CardDescription>
                  <p>{data.description}</p>
                  {(otherDetails || []).map((item) => (
                    <p key={item.label} className="text-sm text-neutral-500">
                      {item.label}: {item.value}
                    </p>
                  ))}
                </CardDescription>
              </div>
            </CardHeader>
            <Badge variant="secondary" className="absolute right-2 top-2">
              {data.type}
            </Badge>
          </Card>
        </PopoverTrigger>
        {popoverContent && (
          <PopoverContent className="min-w-80 w-full">
            {popoverContent}
          </PopoverContent>
        )}
      </Popover>
      <CustomHandle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default EditorCanvasCardSingle;
