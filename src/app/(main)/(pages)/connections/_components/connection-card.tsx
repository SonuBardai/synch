import { ConnectionTypes } from '@/lib/types';
import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import EditorCanvasIconHelper from '../../workflows/editor/[editorId]/_components/editor-canvas-card-icon-hepler';

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback?: () => void;
  connected: {} & any;
};

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {/* @ts-ignore */}
          <EditorCanvasIconHelper type={type} />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connected[type] ? (
          <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white">
            Connected
          </div>
        ) : (
          <Link
            href={
              title == 'Discord'
                ? (process.env.NEXT_PUBLIC_DISCORD_REDIRECT ?? '#')
                : title == 'Notion'
                  ? (process.env.NEXT_PUBLIC_NOTION_AUTH_URL ?? '#')
                  : title == 'Slack'
                    ? (process.env.NEXT_PUBLIC_SLACK_REDIRECT ?? '#')
                    : '#'
            }
            className=" rounded-lg bg-primary p-2 font-bold text-primary-foreground"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
