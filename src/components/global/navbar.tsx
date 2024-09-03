import Link from 'next/link';
import React from 'react';
import { MenuIcon } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { APP_NAME } from '@/lib/constant';

type Props = {};

const Navbar = async (props: Props) => {
  const user = await currentUser();
  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-transparent backdrop-blur-lg z-[100] flex items-center justify-between">
      <aside className="flex items-center gap-[2px]">
        <div className="text-3xl text-black font-bold">{APP_NAME}.</div>
      </aside>
      <aside className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className=" rounded-lg bg-primary p-2 font-bold text-primary-foreground"
        >
          {user ? 'Dashboard' : 'Get Started'}
        </Link>
        {user ? <UserButton afterSignOutUrl="/" /> : null}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
};

export default Navbar;
