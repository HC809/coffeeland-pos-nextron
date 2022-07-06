import cn from "classnames";
import routes from "@/config/routes";
import Logo from "@/components/ui/logo";
import ActiveLink from "@/components/ui/links/active-link";
import { CloseIcon } from "@/components/icons/close-icon";
import { useDrawer } from "@/components/drawer-views/context";
import Scrollbar from "@/components/ui/scrollbar";
import Copyright from "@/layouts/_copyright";
import { BiStore } from "react-icons/bi";
import { FcCancel, FcViewDetails } from "react-icons/fc";
import { GrUnorderedList } from "react-icons/gr";
import { BiPrinter, BiInfoCircle } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import Button from "@/components/ui/button";
import { useModalAction } from "@/components/modal-views/context";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder } from "../store/newOrderSlice";

interface NavLinkProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isCollapse?: boolean;
}

function NavLink({ href, icon, title, isCollapse }: NavLinkProps) {
  return (
    <ActiveLink
      href={href}
      className="hover:bg-light-300 hover:dark:bg-dark-300 xs:px-6 my-0.5 flex items-center gap-1 px-4 py-3 sm:my-1 sm:gap-1.5 sm:px-7 lg:gap-2 xl:my-0.5"
      activeClassName="text-dark-100 active-text-dark dark:active-text-light dark:text-light-400 font-medium bg-light-400 dark:bg-dark-400 hover:bg-light-600 hover:dark:bg-dark-500"
    >
      <span
        className={cn(
          "flex flex-shrink-0 items-center justify-start",
          isCollapse ? "w-8 xl:w-auto" : "w-auto xl:w-8"
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "text-dark-100 dark:text-light-400",
          isCollapse ? "inline-flex xl:hidden" : "hidden xl:inline-flex"
        )}
      >
        {title}
      </span>
    </ActiveLink>
  );
}

export function Sidebar({
  isCollapse,
  className = "hidden sm:flex fixed bottom-0 z-20 pt-[82px]",
}: {
  isCollapse?: boolean;
  className?: string;
}) {
  const { openModal } = useModalAction();
  const { newOrderInfo } = useAppSelector(selectNewOrder);

  return (
    <aside
      className={cn(
        "border-light-400 bg-light-100 text-dark-900 dark:bg-dark-200 h-full flex-col justify-between overflow-y-auto border-r dark:border-0",
        isCollapse ? "sm:w-60 xl:w-[75px]" : "sm:w-[75px] xl:w-60",
        className
      )}
    >
      <Scrollbar className="h-full w-full">
        <div className="flex h-full w-full flex-col">
          <nav className="flex flex-col"></nav>
        </div>
      </Scrollbar>

      <footer
        className={cn(
          "border-light-400 dark:border-dark-400 flex-col border-t pt-3 pb-4 text-center",
          isCollapse ? "flex xl:hidden" : "hidden xl:flex"
        )}
      >
        <Copyright className="text-dark-800/80 dark:text-dark-700 text-xs font-medium" />
      </footer>
    </aside>
  );
}

export default function SidebarDrawerView() {
  const { closeDrawer } = useDrawer();
  return (
    <>
      <div className="xs:px-7 flex h-[70px] items-center justify-between py-2 px-5">
        <Logo />
        <div className="ml-3 flex h-7 items-center">
          <button
            type="button"
            className="text-dark-900 hover:text-dark dark:text-dark-800 hover:dark:text-light-200 -m-2 p-2 outline-none transition-all"
            onClick={closeDrawer}
          >
            <span className="sr-only">Close panel</span>
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Sidebar isCollapse={true} className="text-13px flex" />
    </>
  );
}
