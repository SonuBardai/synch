'use client';

import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const ConnectionWalletButton = () => {
  return (
    <div>
      <WalletMultiButton className="rounded-lg bg-primary p-2 font-bold text-primary-foreground" />
    </div>
  );
};

export default ConnectionWalletButton;
