'use client';
import Workflowform from '@/components/forms/workflow-form';
import CustomModal from '@/components/global/custom-modal';
import { Button } from '@/components/ui/button';
import { useBilling } from '@/providers/billing-provider';
import { useModal } from '@/providers/modal-provider';
import { Plus } from 'lucide-react';
import React from 'react';

const WorkflowButton = () => {
  const { setOpen } = useModal();
  const { credits } = useBilling();

  const handleClick = () => {
    console.log('CLICKED');
    setOpen(
      <CustomModal
        title="Create a Workflow Automation"
        subheading="Workflows help you automate tasks."
      >
        <Workflowform />
      </CustomModal>
    );
  };

  console.log('CREDITS: ', credits);

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handleClick}
      // {...(credits !== "0" // TODO: Check for credits when creating workflows
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
