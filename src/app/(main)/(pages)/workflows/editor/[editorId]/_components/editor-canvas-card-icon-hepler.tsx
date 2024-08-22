'use client';
import React from 'react';
import { TbBrandNotion } from 'react-icons/tb';
import { SiGooglecalendar } from 'react-icons/si';
import { TbCurrencySolana } from 'react-icons/tb';
import { FaDiscord } from 'react-icons/fa6';
import { FiSlack } from 'react-icons/fi';
import {
  CircuitBoard,
  GitBranch,
  Mail,
  MousePointerClickIcon,
  Timer,
  Webhook,
  Zap,
  RefreshCcwDot,
} from 'lucide-react';
import { Actions, Cronjobs, EditorCanvasTypes, Triggers } from '@/lib/types';

type Props = { type: EditorCanvasTypes };

const EditorCanvasIconHelper = ({ type }: Props) => {
  switch (type) {
    case Cronjobs.Cronjob:
      return <RefreshCcwDot className="flex-shrink-0" size={30} />;

    case Triggers.Trigger:
      return <MousePointerClickIcon className="flex-shrink-0" size={30} />;

    case Actions.Email:
      return <Mail className="flex-shrink-0" size={30} />;
    case Actions.Condition:
      return <GitBranch className="flex-shrink-0" size={30} />;
    case Actions.AI:
      return <CircuitBoard className="flex-shrink-0" size={30} />;
    case Actions.Slack:
      return <FiSlack className="flex-shrink-0" size={30} />;
    case Actions.Notion:
      return <TbBrandNotion className="flex-shrink-0" size={30} />;
    case Actions.CustomWebhook:
      return <Webhook className="flex-shrink-0" size={30} />;
    case Actions.GoogleCalendar:
      return <SiGooglecalendar className="flex-shrink-0" size={30} />;
    case Actions.SolanaWalletBalance:
      return <TbCurrencySolana className="flex-shrink-0" size={30} />;
    case Actions.Action:
      return <Zap className="flex-shrink-0" size={30} />;
    case Actions.Discord:
      return <FaDiscord className="flex-shrink-0" size={30} />;
    case Actions.Wait:
      return <Timer className="flex-shrink-0" size={30} />;
    // case 'Google Drive':
    //   return <HardDrive className="flex-shrink-0" size={30} />;
    // case "Solana":
    //   return <Cuboid className="flex-shrink-0" size={30} />;
    default:
      return <Zap className="flex-shrink-0" size={30} />;
  }
};

export default EditorCanvasIconHelper;
