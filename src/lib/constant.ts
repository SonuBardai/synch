import Category from '@/components/icons/category';
import { BiSolidDashboard } from 'react-icons/bi';
import { PiPlugsConnectedFill } from 'react-icons/pi';
import {
  Actions,
  Connection,
  ConnectionTypes,
  Cronjobs,
  EditorCanvasTypes,
  NodeTypes,
  Triggers,
} from './types';

export const clients = [...new Array(10)].map((client, index) => ({
  href: `/${index + 1}.png`,
}));

export const products = [
  {
    title: 'Moonbeam',
    link: 'https://gomoonbeam.com',
    thumbnail: '/p1.png',
  },
  {
    title: 'Cursor',
    link: 'https://cursor.so',
    thumbnail: '/p2.png',
  },
  {
    title: 'Rogue',
    link: 'https://userogue.com',
    thumbnail: '/p3.png',
  },

  {
    title: 'Editorially',
    link: 'https://editorially.org',
    thumbnail: '/p4.png',
  },
  {
    title: 'Editrix AI',
    link: 'https://editrix.ai',
    thumbnail: '/p5.png',
  },
  {
    title: 'Pixel Perfect',
    link: 'https://app.pixelperfect.quest',
    thumbnail: '/p6.png',
  },

  {
    title: 'Algochurn',
    link: 'https://algochurn.com',
    thumbnail: '/p1.png',
  },
  {
    title: 'Aceternity UI',
    link: 'https://ui.aceternity.com',
    thumbnail: '/p2.png',
  },
  {
    title: 'Tailwind Master Kit',
    link: 'https://tailwindmasterkit.com',
    thumbnail: '/p3.png',
  },
  {
    title: 'SmartBridge',
    link: 'https://smartbridgetech.com',
    thumbnail: '/p4.png',
  },
  {
    title: 'Renderwork Studio',
    link: 'https://renderwork.studio',
    thumbnail: '/p5.png',
  },

  {
    title: 'Creme Digital',
    link: 'https://cremedigital.com',
    thumbnail: '/p6.png',
  },
  {
    title: 'Golden Bells Academy',
    link: 'https://goldenbellsacademy.com',
    thumbnail: '/p1.png',
  },
  {
    title: 'Invoker Labs',
    link: 'https://invoker.lol',
    thumbnail: '/p2.png',
  },
  {
    title: 'E Free Invoice',
    link: 'https://efreeinvoice.com',
    thumbnail: '/p3.png',
  },
];

export const menuOptions = [
  {
    name: 'Dashboard',
    Component: BiSolidDashboard,
    href: '/workflows',
    hrefs: ['/dashboard', '/workflows'],
  },
  // { name: "Workflows", Component: Workflows, href: "/workflows" },
  // { name: 'Settings', Component: Settings, href: '/settings' },
  {
    name: 'Connections',
    Component: PiPlugsConnectedFill,
    href: '/connections',
    hrefs: ['/connections'],
  },
  // { name: 'Billing', Component: Payment, href: '/billing' },
  // { name: 'Templates', Component: Templates, href: '/templates' },
  // { name: 'Logs', Component: Logs, href: '/logs' },
];

export type CardType = {
  type: NodeTypes;
  description: string;
};

export const EditorCanvasDefaultCardTypes: Record<EditorCanvasTypes, CardType> =
  {
    [Cronjobs.Cronjob]: {
      description: 'Run the workflow on a scheduled cronjob',
      type: NodeTypes.Cronjob,
    },

    [Triggers.Trigger]: {
      description: 'An event that starts the workflow.',
      type: NodeTypes.Trigger,
    },

    [Actions.SolanaWalletBalance]: {
      description: 'Get the balance of a wallet',
      type: NodeTypes.Action,
    },
    [Actions.TransferSol]: {
      description: 'Transfer SOL from your connected wallet',
      type: NodeTypes.Action,
    },
    [Actions.Email]: {
      description: 'Send and email to a user',
      type: NodeTypes.Action,
    },
    [Actions.Condition]: {
      description: 'Boolean operator that creates different conditions lanes.',
      type: NodeTypes.Action,
    },
    [Actions.AI]: {
      description:
        'Use the power of AI to summarize, respond, create and much more.',
      type: NodeTypes.Action,
    },
    [Actions.Slack]: {
      description: 'Send a notification to slack',
      type: NodeTypes.Action,
    },
    // Solana: {
    //   description: "Action triggered from the Solana blockchain",
    //   type: "Trigger",
    // },
    // 'Google Drive': {
    //   description:
    //     'Connect with Google drive to trigger actions or to create files and folders.',
    //   type: 'Trigger',
    // },
    [Actions.Notion]: {
      description: 'Create entries directly in notion.',
      type: NodeTypes.Action,
    },
    [Actions.CustomWebhook]: {
      description:
        'Connect any app that has an API key and send data to your applicaiton.',
      type: NodeTypes.Action,
    },
    [Actions.Discord]: {
      description: 'Post messages to your discord server',
      type: NodeTypes.Action,
    },
    [Actions.GoogleCalendar]: {
      description: 'Create a calendar invite.',
      type: NodeTypes.Action,
    },
    [Actions.Action]: {
      description: 'An event that happens after the workflow begins',
      type: NodeTypes.Action,
    },
    [Actions.Wait]: {
      description: 'Delay the next action step by using the wait timer.',
      type: NodeTypes.Action,
    },
  };

export const CONNECTIONS: Connection[] = [
  // {
  //   title: 'Google Drive',
  //   description: 'Connect your google drive to listen to folder changes',
  //   image: '/googleDrive.png',
  //   connectionKey: 'googleNode',
  //   // alwaysTrue: true,
  // },
  {
    title: ConnectionTypes.SolanaWallet,
    description: 'Connect your solana wallet',
    image: '/solana.png',
    connectionKey: 'walletAddress',
  },
  {
    title: ConnectionTypes.Discord,
    description: 'Connect your discord to send notification and messages',
    image: '/discord.png',
    connectionKey: 'discordNode',
    accessTokenKey: 'webhookURL',
  },
  {
    title: ConnectionTypes.Notion,
    description: 'Create entries in your notion dashboard and automate tasks.',
    image: '/notion.png',
    connectionKey: 'notionNode',
    accessTokenKey: 'accessToken',
  },
  {
    title: ConnectionTypes.Slack,
    description:
      'Use slack to send notifications to team members through your own custom bot.',
    image: '/slack.png',
    connectionKey: 'slackNode',
    accessTokenKey: 'slackAccessToken',
    slackSpecial: true,
  },
];
