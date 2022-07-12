import { Fragment } from "react";
import { useRouter } from "next/router";
import Avatar from "react-avatar";
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
import { removeTaxInfo } from "@/store/taxInfoSlice";
import { setCloseShift } from "@/store/shiftInfoSlice";
import { cancelNewOrder, selectNewOrder } from "@/store/newOrderSlice";
import routes from "@/config/routes";
import { AiFillAppstore } from "react-icons/ai";
import toast from "react-hot-toast";
import { NewOrderStartButton } from "@/components/new-order/new-order-start";
import { InvoiceOptionsHeader } from "./_invoice-option-header";

function AuthorizedMenu({ user }: { user: ILoggedUser }) {
  const { openModal } = useModalAction();

  const { newOrderInfo } = useAppSelector(selectNewOrder);

  const dispatch = useAppDispatch();

  return (
    <Menu>
      <Menu.Button className="border-light-400 bg-light-300 dark:border-dark-500 dark:bg-dark-500 relative inline-flex h-8 w-8 justify-center rounded-full border">
        <Avatar
          size="32"
          round={true}
          name={user.name || ""}
          textSizeRatio={2}
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
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors hover:bg-light-400 dark:hover:bg-dark-600 w-full px-5 py-2.5 text-left"
              onClick={() => {
                if (newOrderInfo.started) {
                  return toast.error(
                    "Debe finalizar o cancelar la orden actual antes de poder actualizar los productos.",
                    { duration: 4000 }
                  );
                } else openModal("UPDATE_PRODUCTS_VIEW");
              }}
            >
              Actualizar Productos
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors hover:bg-light-400 dark:hover:bg-dark-600 w-full px-5 py-2.5 text-left"
              onClick={async () => openModal("TAX_INFO_VIEW")}
            >
              Información Fiacal
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              type="button"
              className="transition-fill-colors hover:bg-light-400 dark:hover:bg-dark-600 w-full px-5 py-2.5 text-left"
              onClick={async () => openModal("PRINTER_CONFIG_VIEW")}
            >
              Configuración Impresora
            </button>
          </Menu.Item>
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
              Finalizar Turno
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

export default function Header() {
  const router = useRouter();
  const { newOrderInfo } = useAppSelector(selectNewOrder);

  useSwapBodyClassOnScrollDirection();
  return (
    <header className="app-header border-light-300 bg-light dark:border-dark-300 dark:bg-dark-250 sticky top-0 left-0 z-30 flex h-full w-full items-center justify-between border-b py-1 px-4 sm:h-[100px] sm:px-6">
      <div className="flex items-center gap-4">
        <img
          width="90px"
          height="70px"
          className="ml-auto mr-auto"
          src="/images/coffeeland-logo.png"
        />
      </div>
      <div className="xs:gap-6 relative flex items-center gap-5 pr-0.5 sm:gap-7">
        {newOrderInfo.started ? (
          <>
            <Button
              onClick={() => router.push(routes.home)}
              variant="icon"
              aria-label="Layout"
              className="2xl:w- text-center text-base font-medium 2xl:flex"
            >
              <AiFillAppstore size={25} color="#0D9965" /> Categorias
            </Button>
            <InvoiceOptionsHeader />
          </>
        ) : (
          <NewOrderStartButton />
        )}

        <LoginMenu />
      </div>
    </header>
  );
}
