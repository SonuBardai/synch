'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { APP_NAME, menuOptions } from '@/lib/constant';
import clsx from 'clsx';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '../global/mode-toggle';
import { UserButton } from '@clerk/nextjs';

type Props = {};

const MenuOptions = (props: Props) => {
  const pathName = usePathname();

  return (
    <nav className=" dark:bg-background h-screen overflow-scroll  justify-between flex items-center flex-col  gap-10 py-6 px-2">
      <div className="flex items-center justify-center flex-col gap-8">
        <Link className="flex font-bold flex-row " href="/">
          {APP_NAME}.
        </Link>
        <TooltipProvider>
          {menuOptions.map((menuItem) => {
            const selected = (menuItem.hrefs ?? []).some((href) =>
              pathName.startsWith(href)
            );
            return (
              <ul key={menuItem.name}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <li>
                      <Link
                        href={menuItem.href ?? '#'}
                        className={clsx(
                          `group h-8 w-8 flex items-center justify-center  scale-[1.5] rounded-lg p-[3px]  cursor-pointer ${
                            selected ? 'bg-[#EEE0FF]' : ''
                          }`
                        )}
                      >
                        <menuItem.Component
                          className={selected ? 'fill-[#2F006B]' : ''}
                        />
                      </Link>
                    </li>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-background/10 backdrop-blur-xl"
                  >
                    <p>{menuItem.name}</p>
                  </TooltipContent>
                </Tooltip>
              </ul>
            );
          })}
        </TooltipProvider>
        <Separator />
      </div>
      <UserButton />
    </nav>
  );
};

export default MenuOptions;
