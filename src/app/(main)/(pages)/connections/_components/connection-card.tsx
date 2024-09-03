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
import ConnectionWalletButton from '@/components/forms/ConnectionWalletButton';

type Props = {
  type: ConnectionTypes;
  icon: string;
  title: ConnectionTypes;
  description: string;
  callback?: () => void;
  connected: {} & any;
};

const DISCORD_SCOPES = [
  'identify',
  'guilds',
  'connections',
  'guilds.members.read',
  'email',
  'webhook.incoming',
];

export const buildDiscordUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  if (!clientId) return '#';

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window !== 'undefined' && window.location.origin);
  if (!baseUrl) return '#';

  const redirectUri = `${baseUrl}/api/auth/callback/discord`;

  const url = new URL('https://discord.com/oauth2/authorize');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('redirect_uri', redirectUri);
  const scopes = DISCORD_SCOPES.join(' ');
  url.searchParams.append('scope', scopes);

  return url.toString();
};

const ConnectionCard = ({ description, type, title, connected }: Props) => {
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          {/* @ts-expect-error type is the same as EditorCanvasType */}
          <EditorCanvasIconHelper type={type} />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connected[type] ? (
          <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold">
            Connected
          </div>
        ) : title === ConnectionTypes.SolanaWallet ? (
          <ConnectionWalletButton />
        ) : (
          <Link
            href={
              title == ConnectionTypes.Discord
                ? buildDiscordUrl()
                : title == ConnectionTypes.Notion
                  ? (process.env.NEXT_PUBLIC_NOTION_AUTH_URL ?? '#')
                  : title == ConnectionTypes.Slack
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
