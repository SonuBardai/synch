'use server';

import { db } from '@/lib/db';

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  console.log(state);
  const published = await db.workflows.update({
    where: {
      id: workflowId,
    },
    data: {
      publish: state,
    },
  });

  if (published.publish) return 'Workflow published';
  return 'Workflow unpublished';
};

export const onRemoveFlow = async (workflowId: string) => {
  const response = await db.workflows.delete({
    where: {
      id: workflowId,
    },
  });
  if (response) {
    return 'Workflow removed';
  }
};
