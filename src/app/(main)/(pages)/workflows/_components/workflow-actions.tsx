'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { onFlowPublish, onRemoveFlow } from '@/actions/workflow-actions';
import { useModal } from '@/providers/modal-provider';
import CustomModal from '@/components/global/custom-modal';
import Workflowform from '@/components/forms/workflow-form';
import { useRouter } from 'next/navigation';
import { onUpdateWorkflow } from '../_actions/workflow-connections';

const WorkflowActions = ({
  id,
  name,
  description,
  publish,
}: {
  id: string;
  name: string;
  description: string;
  publish: boolean | null;
}) => {
  const { setOpen } = useModal();
  const router = useRouter();

  const onPublishFlow = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const response = await onFlowPublish(
      id,
      // @ts-expect-error ariachecked does exist in a switch
      event.target.ariaChecked === 'false'
    );
    if (response) toast.message(response);
  };

  const onRemove = async () => {
    const response = await onRemoveFlow(id);
    if (response) toast.message(response);
    router.refresh();
  };

  const onEdit = () => {
    const handleEdit = async () => {
      const updatedResponse = await onUpdateWorkflow(id, name, description);
      if (updatedResponse) toast.message(updatedResponse.message);
      router.refresh();
    };

    setOpen(
      <CustomModal title="Update Workflow" subheading="">
        <Workflowform
          initialValues={{
            name,
            description,
          }}
          onSubmit={handleEdit}
        />
      </CustomModal>
    );
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
      <Button onClick={onEdit} variant="outline">
        <Edit />
      </Button>
      <Button onClick={onRemove} variant="destructive">
        <Trash />
      </Button>
    </div>
  );
};

export default WorkflowActions;
