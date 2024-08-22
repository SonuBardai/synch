'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { onFlowPublish, onRemoveFlow } from '../_actions/workflow-connections';

const WorkflowActions = ({
  id,
  publish,
}: {
  id: string;
  publish: boolean | null;
}) => {
  const onPublishFlow = async (event: any) => {
    const response = await onFlowPublish(
      id,
      event.target.ariaChecked === 'false'
    );
    if (response) toast.message(response);
  };

  const onRemove = async () => {
    const response = await onRemoveFlow(id);
    if (response) toast.message(response);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4 p-4">
      <span className="flex flex-col items-center gap-2 p-4">
        <Label htmlFor="airplane-mode" className="text-muted-foreground">
          {publish! ? 'On' : 'Off'}
        </Label>
        <Switch
          id="airplane-mode"
          onClick={onPublishFlow}
          defaultChecked={publish!}
        />
      </span>
      <Button onClick={onRemove} variant="destructive">
        <Trash />
      </Button>
    </div>
  );
};

export default WorkflowActions;
