import cn from "classnames";
import Logo from "@/components/ui/logo";
import { CloseIcon } from "@/components/icons/close-icon";
import { useDrawer } from "@/components/drawer-views/context";
import Scrollbar from "@/components/ui/scrollbar";
import DrawersContainer from "@/components/drawer-views/container";

export function Sidebar({
  isCollapse,
  className = "sm:flex fixed bottom-0 z-20 pt-[82px]",
}: {
  isCollapse?: boolean;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "border-light-400 bg-light-100 text-dark-900 dark:bg-dark-200 h-full w-4/12 flex-col justify-between overflow-y-auto border-r dark:border-0",
        className
      )}
    >
      <Scrollbar className="h-full w-full">
        <div className="flex h-full w-full flex-col pt-5">
          <DrawersContainer />
        </div>
      </Scrollbar>

      <footer
        className={cn(
          "border-light-400 dark:border-dark-400 flex-col border-t pt-3 pb-4 text-center",
          isCollapse ? "flex xl:hidden" : "hidden xl:flex"
        )}
      ></footer>
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
