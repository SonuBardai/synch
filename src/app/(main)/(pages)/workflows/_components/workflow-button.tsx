'use client';
import Workflowform from '@/components/forms/workflow-form';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';
import { useBilling } from '@/providers/billing-provider';
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react';
import React from 'react';
import { onCreateWorkflow } from '../_actions/workflow-connections';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const WorkflowButton = () => {
  const { setOpen } = useModal();
  const { credits } = useBilling();
  const router = useRouter();

  const handleClick = () => {
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows help you automate tasks."
      >
        <Workflowform
          onSubmit={async (values) => {
            const workflow = await onCreateWorkflow(
              values.name,
              values.description
            );
            if (workflow) {
              toast.message(workflow.message);
              router.refresh();
            }
          }}
        />
      </CustomModal>
    );
  };

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handleClick}
      // {...(credits !== "0" // TODO: Check for credits when creating workflows when implementing billing
      //   ? {
      //       onClick: handleClick,
      //     }
      //   : {
      //       disabled: true,
      //     })}
    >
      <Plus /> New Workflow
    </Button>
  );
};

export default WorkflowButton;
