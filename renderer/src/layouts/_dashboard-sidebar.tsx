import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Listbox, Transition } from "@headlessui/react";
import routes from "@/config/routes";
import ActiveLink from "@/components/ui/links/active-link";
import { PurchaseIcon } from "@/components/icons/purchase-icon";
import { UserIconAlt } from "@/components/icons/user-icon-alt";
import { LockIcon } from "@/components/icons/lock-icon";
import { LogoutIcon } from "@/components/icons/logout-icon";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

function SidebarNav() {
  return (
    <nav className="hidden flex-col text-13px text-dark-900 lg:flex">
      <button
        onClick={() => {}}
        className="flex w-full items-center gap-2.5 px-6 py-3.5 text-left hover:text-dark focus:text-dark dark:hover:text-light dark:focus:text-light "
      >
        <LogoutIcon className="h-6 w-6" />
        <span className="text-dark-100 dark:text-light-400">Logout</span>
      </button>
    </nav>
  );
}

function SidebarMobileNav() {
  const { pathname } = useRouter();

  return <nav className="mb-8 flex flex-col xs:mb-10 sm:mb-12 lg:hidden"></nav>;
}

export default function Sidebar() {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  return (
    <aside className="border-light-300 dark:border-dark-400 lg:w-60 lg:flex-shrink-0 lg:border-r lg:bg-light lg:dark:bg-dark-250">
      {isMounted && ["xs", "sm", "md"].indexOf(breakpoint) !== -1 ? (
        <SidebarMobileNav />
      ) : (
        <SidebarNav />
      )}
    </aside>
  );
}
