"use client";
import Workflowform from "@/components/forms/workflow-form";
import CustomModal from "@/components/global/customModal";
import { Button } from "@/components/ui/button";
import { useBilling } from "@/providers/billing-provider";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import React from "react";

const WorkflowButton = () => {
  const { setOpen } = useModal();
  const { credits } = useBilling();

  const handleClick = () => {
    console.log("CLICKED");
    setOpen(
      <CustomModal title="Create a Workflow Automation" subheading="Workflows help you automate tasks.">
        <Workflowform />
      </CustomModal>
    );
  };

  console.log("CREDITS: ", credits);

  return (
    <Button
      size={"icon"}
      onClick={handleClick}
      // {...(credits !== "0"
      //   ? {
      //       onClick: handleClick,
      //     }
      //   : {
      //       disabled: true,
      //     })}
    >
      <Plus />
    </Button>
  );
};

export default WorkflowButton;