import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Listbox, Transition } from "@headlessui/react";
import routes from "@/config/routes";
import ActiveLink from "@/components/ui/links/active-link";
import { fadeInBottom } from "@/lib/framer-motion/fade-in-bottom";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";

function SidebarNav() {
  return <nav className="hidden pt-4 text-13px md:flex lg:flex-col"></nav>;
}

function SidebarMobileNav() {
  const { pathname } = useRouter();

  return <nav className="mb-6 flex flex-col sm:mb-8 md:hidden"></nav>;
}

export default function GeneralContainer({
  children,
}: React.PropsWithChildren<{}>) {
  const breakpoint = useBreakpoint();
  const isMounted = useIsMounted();
  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-md bg-light p-4 shadow-card dark:bg-dark-200 dark:shadow-none xs:p-5 md:p-8 lg:flex-row lg:p-0">
      <aside className="shrink-0 justify-center border-light-300 dark:border-dark-400 md:flex md:border-b lg:block lg:w-72 lg:border-b-0 lg:border-r lg:dark:border-dark-300 lg:dark:bg-dark-250 xl:w-80">
        {isMounted && ["xs", "sm"].indexOf(breakpoint) !== -1 ? (
          <SidebarMobileNav />
        ) : (
          <SidebarNav />
        )}
      </aside>
      <motion.div
        variants={fadeInBottom()}
        className="w-full flex-grow pt-4 pb-4 sm:pb-2 md:pt-10 lg:p-10 xl:p-12"
      >
        {children}
      </motion.div>
    </div>
  );
}
