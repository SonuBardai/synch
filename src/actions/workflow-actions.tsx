'use server';

import { db } from '@/lib/db';
import { NodeTypes, RunEveryUnitOptions } from '@/lib/types';
import { Workflows } from '@prisma/client';
import axios from 'axios';

const getSchedule = (
  repeatEvery: number,
  repeatEveryUnit: RunEveryUnitOptions
) => {
  let schedule: any = {
    timezone: 'UTC',
    expiresAt: 0,
    hours: [-1], // All hours
    mdays: [-1], // All days
    minutes: [-1], // All minutes
    months: [-1], // All months
    wdays: [-1], // All weekdays
  };
  switch (repeatEveryUnit) {
    case 'minute':
      schedule.minutes = Array.from({ length: 60 }, (_, i) =>
        i % repeatEvery === 0 ? i : null
      ).filter((i) => i !== null);
      break;
    case 'hour':
      schedule.minutes = [0]; // At the beginning of each hour
      schedule.hours = Array.from({ length: 24 }, (_, i) =>
        i % repeatEvery === 0 ? i : null
      ).filter((i) => i !== null);
      break;
    case 'day':
      schedule.minutes = [0]; // At the beginning of each hour
      schedule.hours = [0]; // At midnight
      schedule.mdays = Array.from({ length: 31 }, (_, i) =>
        (i + 1) % repeatEvery === 0 ? i + 1 : null
      ).filter((i) => i !== null);
      break;
    case 'week':
      schedule.minutes = [0]; // At the beginning of each hour
      schedule.hours = [0]; // At midnight
      schedule.wdays = Array.from({ length: 7 }, (_, i) =>
        i % repeatEvery === 0 ? i : null
      ).filter((i) => i !== null);
      break;
    case 'month':
      schedule.minutes = [0]; // At the beginning of each hour
      schedule.hours = [0]; // At midnight
      schedule.mdays = [1]; // On the 1st of each month
      schedule.months = Array.from({ length: 12 }, (_, i) =>
        (i + 1) % repeatEvery === 0 ? i + 1 : null
      ).filter((i) => i !== null);
      break;
    default:
      throw new Error('Invalid repeatEveryUnit in cronjob config');
  }
  return schedule;
};

const scheduleCronjob = async (workflow: Workflows) => {
  if (!workflow) {
    console.error('Workflow not found');
    return;
  }
  const { id } = workflow;
  const nodes = JSON.parse(workflow.nodes ?? '{}');
  const cronjobNode = nodes?.find(
    (node: any) => node.type === NodeTypes.Cronjob
  );
  if (!cronjobNode) {
    console.error('Cronjob node not found');
    return;
  }
  const cronjobConfig = cronjobNode?.data?.metadata?.cronjobConfig;
  if (!cronjobConfig) {
    console.error('Cronjob config not found');
    return;
  }
  const { repeatEvery, repeatEveryUnit } = cronjobConfig;
  const schedule = getSchedule(repeatEvery, repeatEveryUnit);

  const res = await axios.put(
    'https://api.cron-job.org/jobs',
    {
      job: {
        url: `${process.env.NGROK_URI}/api/workflows/run?flow_id=${id}`,
        enabled: 'true',
        schedule,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.status !== 200) {
    console.error('Error scheduling cronjob:', res.data);
    return;
  }

  return res;
};

const deleteCronjob = async (workflow: Workflows) => {
  if (!workflow) {
    console.error('Workflow not found');
    return;
  }
  const nodes = JSON.parse(workflow.nodes ?? '{}');
  const cronjobNode = nodes?.find(
    (node: any) => node.type === NodeTypes.Cronjob
  );
  if (!cronjobNode) {
    console.error('Cronjob node not found');
    return;
  }
  const cronjobConfig = cronjobNode?.data?.metadata?.cronjobConfig;
  if (!cronjobConfig) {
    console.error('Cronjob config not found');
    return;
  }
  const jobId = cronjobConfig.jobId;
  if (!jobId) {
    console.error('Job ID not found');
    return;
  }
  const res = await axios.delete(`https://api.cron-job.org/jobs/${jobId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
      'Content-Type': 'application/json',
    },
  });
  return res;
};

const manageCronjob = async (workflowId: string, state: boolean) => {
  const workflow = await db.workflows.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    console.error('Workflow not found');
    return;
  }
  if (state) {
    const res = await scheduleCronjob(workflow);
    if (!res) {
      console.error('Error scheduling cronjob');
      return;
    }
    const nodes = JSON.parse(workflow.nodes ?? '{}');
    const jobId = res.data.jobId;
    const updatedNodes = nodes.map((node: any) => {
      if (node.type === NodeTypes.Cronjob) {
        return {
          ...node,
          data: {
            ...node.data,
            metadata: {
              ...node.data.metadata,
              cronjobConfig: {
                ...node.data.metadata.cronjobConfig,
                jobId,
              },
            },
          },
        };
      }
      return node;
    });
    await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        nodes: JSON.stringify(updatedNodes),
      },
    });
  } else {
    await deleteCronjob(workflow);
    const nodes = JSON.parse(workflow.nodes ?? '{}');
    const updatedNodes = nodes.map((node: any) => {
      if (node.type === NodeTypes.Cronjob) {
        return {
          ...node,
          data: {
            ...node.data,
            metadata: {
              ...node.data.metadata,
              cronjobConfig: {
                ...node.data.metadata.cronjobConfig,
                jobId: null,
              },
            },
          },
        };
      }
      return node;
    });
    await db.workflows.update({
      where: {
        id: workflowId,
      },
      data: {
        nodes: JSON.stringify(updatedNodes),
      },
    });
  }
};

export const onFlowPublish = async (workflowId: string, state: boolean) => {
  // manageCronjob(workflowId, state);
  const workflow = await db.workflows.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    console.error('Workflow not found');
    return;
  }
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
