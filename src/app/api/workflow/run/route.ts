import { db } from '@/lib/db';
import { Actions } from '@/lib/types';
import { currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';
import { Connection, PublicKey } from '@solana/web3.js';
import { NextRequest, NextResponse } from 'next/server';

async function getSolanaWalletBalance(publicKeyString: string) {
  try {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const publicKey = new PublicKey(publicKeyString);
    const balance = await connection.getBalance(publicKey);
    const balanceInSol = balance / 1e9;
    return balanceInSol;
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return null;
  }
}

const executeNode = async (node: any, user: User, context: any = {}) => {
  let result = {};
  switch (node.type) {
    case Actions.SolanaWalletBalance:
      const solanaWalletId = user.solWalletId;
      if (!solanaWalletId) {
        throw new Error('Solana wallet not connected');
      }
      const solanaWallet = await db.solWallet.findFirst({
        where: {
          id: solanaWalletId,
        },
      });
      if (!solanaWallet) {
        throw new Error('Solana wallet not found');
      }
      const publicKey = solanaWallet?.address;
      const balance = await getSolanaWalletBalance(publicKey);
      result = { balance };
      break;

    case Actions.Condition:
      console.log('Condition: ', context);
      break;

    case Actions.TransferSol:
      console.log('Checking Solana Wallet Balance:', context);
      break;

    default:
      console.error('Unknown node type:', node.type);
  }
  return { ...context, ...result };
};

const traverseAndExecute = async (
  currentNode: any,
  nodes: any[],
  edges: any[],
  user: User,
  state: any = {}
) => {
  const outgoingEdges = edges.filter(
    (edge: any) => edge.source === currentNode.id
  );

  for (const edge of outgoingEdges) {
    const targetNode = nodes.find((node: any) => node.id === edge.target);
    if (targetNode) {
      const newState = await executeNode(targetNode, user, state);
      await traverseAndExecute(targetNode, nodes, edges, user, newState);
    }
  }
};

export async function POST(req: NextRequest) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }
  const user = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });
  if (!user) {
    return NextResponse.json(
      {
        message: 'User not found',
      },
      {
        status: 404,
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

    if (workflow.userId !== user.clerkId) {
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
      await traverseAndExecute(node, nodes, edges, user, {});
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