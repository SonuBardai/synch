'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AddCronjobSchema,
  CronjobConfigType,
  RunEveryUnitOptions,
} from '@/lib/types';
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
import { Workflows } from '@prisma/client';

type Props = {
  workflow: Workflows;
  onUpdate: (cronjobConfig: CronjobConfigType) => Promise<any>;
};

const getCronjobsConfigFromWorkflow = (workflow: Workflows) => {
  return {
    cronRepeatEvery: workflow.cronRepeatEvery ?? 1,
    cronRepeatEveryUnit:
      (workflow.cronRepeatEveryUnit as RunEveryUnitOptions) ??
      RunEveryUnitOptions.minute,
  };
};

const CronjobForm = ({ workflow, onUpdate }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof AddCronjobSchema>>({
    mode: 'onChange',
    resolver: zodResolver(AddCronjobSchema),
    defaultValues: getCronjobsConfigFromWorkflow(workflow),
  });

  const handleSubmit = async (values: z.infer<typeof AddCronjobSchema>) => {
    setIsLoading(true);
    await onUpdate(values);
    setIsLoading(false);
  };

  useEffect(() => {
    form.reset(getCronjobsConfigFromWorkflow(workflow));
  }, [workflow]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="cronRepeatEvery"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Run the cronjob every</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="1"
                  type="number"
                  defaultValue={1}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      form.setValue('cronRepeatEvery', 1);
                    } else {
                      form.setValue(
                        'cronRepeatEvery',
                        parseInt(e.target.value)
                      );
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cronRepeatEveryUnit"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Run the cronjob every</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none"
                >
                  {Object.values(RunEveryUnitOptions).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="self-start hover:bg-[#2F006B] hover:text-white"
        >
          {isLoading ? (
            <span>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            'Save Cronjob'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CronjobForm;
