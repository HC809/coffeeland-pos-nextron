import { Fragment } from "react";
import { useRouter } from "next/router";
import Avatar from "react-avatar";
import routes from "@/config/routes";
import { Menu } from "@/components/ui/dropdown";
import { Transition } from "@/components/ui/transition";
import { UserIcon } from "@/components/icons/user-icon";
import { useIsMounted } from "@/lib/hooks/use-is-mounted";
import { useSwapBodyClassOnScrollDirection } from "@/lib/hooks/use-swap-body-class";
import { useModalAction } from "@/components/modal-views/context";
import Button from "@/components/ui/button";
import { useAppSelector } from "@/hooks/reduxHooks";
import { logout, selectAuth } from "@/store/authSlice";
import { ILoggedUser } from "@/models/Authentication/Authentication.models";
import { useAppDispatch } from "../hooks/reduxHooks";
import { removeAuthUser } from "@/services/AuthenticationService";
import Image from "@/components/ui/image";
import { siteSettings } from "@/data/static/site-settings";
import { removeTaxInfo } from "@/store/taxInfoSlice";
import { setCloseShift } from "@/store/shiftInfoSlice";
import { cancelNewOrder } from "@/store/newOrderSlice";
import ThemeSwitcher from "@/components/ui/theme-switcher";

function AuthorizedMenu({ user }: { user: ILoggedUser }) {
  const dispatch = useAppDispatch();

  return (
    <Menu>
      <Menu.Button className="border-light-400 bg-light-300 dark:border-dark-500 dark:bg-dark-500 relative inline-flex h-8 w-8 justify-center rounded-full border">
        <Avatar
          size="32"
          round={true}
          name={user.username || ""}
          textSizeRatio={2}
          //src={user?.profile?.avatar?.thumbnail}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="bg-light text-dark shadow-dropdown dark:bg-dark-250 dark:text-light absolute top-[84%] right-0 z-30 mt-4 w-56 origin-top-right rounded-md py-1.5">
          {/* {AuthorizedMenuItems.map((item) => (
            <Menu.Item key={item.label}>
              <ActiveLink
                href={item.path}
                className="transition-fill-colors flex w-full items-center px-5 py-2.5 hover:bg-light-400 dark:hover:bg-dark-600"
              >
                {item.label}
              </ActiveLink>
            </Menu.Item>
          ))} */}
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors hover:bg-light-400 dark:hover:bg-dark-600 w-full px-5 py-2.5 text-left"
              onClick={async () => {
                await dispatch(cancelNewOrder());
                await dispatch(setCloseShift());
                await dispatch(removeTaxInfo());
                await dispatch(logout());
                removeAuthUser();
              }}
            >
              Logout
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function LoginMenu() {
  const { openModal } = useModalAction();
  const isMounted = useIsMounted();

  const auth = useAppSelector(selectAuth);

  if (!isMounted) {
    return (
      <div className="bg-light-300 dark:bg-dark-500 h-8 w-8 animate-pulse rounded-full" />
    );
  }
  if (auth?.logged) {
    return <AuthorizedMenu user={auth} />;
  }
  return (
    <Button
      variant="icon"
      aria-label="User"
      className="flex"
      onClick={() => openModal("LOGIN_VIEW")}
    >
      <UserIcon className="h-5 w-5" />
    </Button>
  );
}

interface HeaderProps {
  isCollapse?: boolean;
  showHamburger?: boolean;
  onClickHamburger?: () => void;
}

export default function Header({
  isCollapse,
  showHamburger = false,
  onClickHamburger,
}: HeaderProps) {
  const { asPath } = useRouter();
  const { lightLogo } = siteSettings;

  useSwapBodyClassOnScrollDirection();
  return (
    <header className="app-header border-light-300 bg-light dark:border-dark-300 dark:bg-dark-250 sticky top-0 left-0 z-30 flex h-16 w-full items-center justify-between border-b py-1 px-4 sm:h-[70px] sm:px-6">
      <div className="flex items-center gap-4">
        {/* {showHamburger && (
          <Hamburger
            isToggle={isCollapse}
            onClick={onClickHamburger}
            className="hidden sm:flex"
          />
        )} */}
        <Image src={lightLogo} width={70} height={50} />
      </div>
      <div className="xs:gap-6 relative flex items-center gap-5 pr-0.5 sm:gap-7">
        <ThemeSwitcher />
        {/* <SearchButton className="hidden sm:flex" />
        <ThemeSwitcher />
        <GridSwitcher />
        {asPath !== routes.checkout && (
          <CartButton className="hidden sm:flex" />
        )} */}
        <LoginMenu />
      </div>
    </header>
  );
}
