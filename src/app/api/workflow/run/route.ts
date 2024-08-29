import { db } from '@/lib/db';
import { Actions } from '@/lib/types';
import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const executeNode = async (node: any) => {
  switch (node.type) {
    // case Cronjobs.Cronjob:
    //   break;

    case Actions.SolanaWalletBalance:
      break;

    case Actions.Condition:
      break;

    case Actions.TransferSol:
      console.log('Checking Solana Wallet Balance:', node);
      break;

    default:
      console.error('Unknown node type:', node.type);
  }
};

const traverseAndExecute = async (
  currentNode: any,
  nodes: any[],
  edges: any[]
) => {
  const outgoingEdges = edges.filter(
    (edge: any) => edge.source === currentNode.id
  );

  for (const edge of outgoingEdges) {
    const targetNode = nodes.find((node: any) => node.id === edge.target);
    if (targetNode) {
      await executeNode(targetNode);
      await traverseAndExecute(targetNode, nodes, edges);
    }
  }
};
export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  try {
    const { workflow_id } = await req.json();
    const workflow = await db.workflows.findUnique({
      where: { id: workflow_id },
    });
    if (!workflow) {
      return NextResponse.json(
        {
          message: 'Workflow not found',
        },
        {
          status: 404,
        }
      );
    }

    if (workflow.userId !== user.id) {
      return NextResponse.json(
        {
          message: 'You are not authorized to execute this workflow',
        },
        {
          status: 403,
        }
      );
    }

    const nodes = workflow.nodes ? JSON.parse(workflow.nodes) : [];
    const edges = workflow.edges ? JSON.parse(workflow.edges) : [];

    const startNodeIds = edges.map((edge: any) => edge.source);
    const startNodes = nodes.filter((node: any) =>
      startNodeIds.includes(node.id)
    );

    for (const node of startNodes) {
      await traverseAndExecute(node, nodes, edges);
    }

    return NextResponse.json(
      {
        message: 'Workflow executed successfully',
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error executing workflow:', error);

    const errorMessage =
      (error as Error).message ||
      'An error occurred while executing the workflow';

    return NextResponse.json(
      {
        message: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
