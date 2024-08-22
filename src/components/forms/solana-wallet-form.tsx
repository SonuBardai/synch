'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

const SolanaWalletSchema = z.object({
  address: z
    .string()
    .min(32, 'Invalid address')
    .max(44, 'Invalid address')
    .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, 'Invalid address format'),
});

type SolanaWalletFormValues = z.infer<typeof SolanaWalletSchema>;

type Props = {
  walletAddress: string;
  onUpdate?: (address: string) => Promise<void>;
};

const SolanaWalletForm = ({ walletAddress, onUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SolanaWalletFormValues>({
    mode: 'onChange',
    resolver: zodResolver(SolanaWalletSchema),
    defaultValues: {
      address: walletAddress,
    },
  });

  const handleSubmit = async (values: SolanaWalletFormValues) => {
    setIsLoading(true);
    if (onUpdate) {
      await onUpdate(values.address);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    form.reset({ address: walletAddress });
  }, [walletAddress]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Solana Wallet Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter the Solana wallet address you want to track"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="self-start hover:bg-[#2F006B] hover:text-white "
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            'Save Wallet Address'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SolanaWalletForm;
