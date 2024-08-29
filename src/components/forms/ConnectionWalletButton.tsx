'use client';

import React, { useEffect } from 'react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { APP_NAME } from '@/lib/constant';

const ConnectionWalletButton = () => {
  const { publicKey, signMessage } = useWallet();

  async function signAndSend() {
    if (!publicKey) {
      return;
    }
    const message = new TextEncoder().encode(
      `Connect your wallet to ${APP_NAME}`
    );
    const signature = await signMessage?.(message);
    const response = await axios.post('/api/user/connect-wallet', {
      signature,
      publicKey: publicKey?.toString(),
    });

    localStorage.setItem('token', response.data.token);
  }
  useEffect(() => {
    if (publicKey) {
      signAndSend();
    }
  }, [publicKey]);

  return (
    <div>{publicKey ? <WalletDisconnectButton /> : <WalletMultiButton />}</div>
  );
};

export default ConnectionWalletButton;
