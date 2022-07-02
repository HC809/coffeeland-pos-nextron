import cn from "classnames";
import { motion } from "framer-motion";
import Header from "@/layouts/_header";
import DrawersContainer from "@/components/drawer-views/container";
import Button from "@/components/ui/button";
import { useModalAction } from "@/components/modal-views/context";
import { AiFillDelete } from "react-icons/ai";
import { FcCancel, FcViewDetails } from "react-icons/fc";
import { GrUnorderedList } from "react-icons/gr";
import { BiPrinter, BiInfoCircle } from "react-icons/bi";
import { BiEdit, BiStore } from "react-icons/bi";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectNewOrder } from "../store/newOrderSlice";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const { openModal } = useModalAction();

  const { newOrderInfo } = useAppSelector(selectNewOrder);

  return (
    <motion.div
      initial="exit"
      animate="enter"
      exit="exit"
      className="bg-light-300 dark:bg-dark-100 flex min-h-screen w-full flex-col"
    >
      <Header />
      {newOrderInfo.started && (
        <nav className="rounded border-gray-200 bg-gray-200 bg-white px-2 py-2.5 dark:bg-gray-800 sm:px-4">
          <div className="container mx-auto flex flex-wrap items-center justify-between">
            <div className="flex md:order-2">
              <div className="relative hidden px-5 md:block">
                <Button
                  onClick={() => openModal("NEW_ORDER_VIEW")}
                  variant="text"
                  className="dark:bg-dark-100 dark:hover:bg-dark-200 text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 md:h-[52px]"
                >
                  <BiEdit size={25} /> Editar
                </Button>
              </div>
              <div className="relative hidden px-5 md:block">
                <Button
                  onClick={() => alert("Detalle Venta")}
                  variant="text"
                  className="dark:bg-dark-100 dark:hover:bg-dark-200 text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 md:h-[52px]"
                >
                  <FcViewDetails size={25} /> Detalle
                </Button>
              </div>
              <div className="relative hidden pl-5 md:block">
                <Button
                  onClick={() => openModal("CANCEL_NEW_ORDER_VIEW")}
                  variant="text"
                  className="dark:bg-dark-100 dark:hover:bg-dark-200 text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 md:h-[52px]"
                >
                  {" "}
                  <AiFillDelete color="#DA0525" size={25} />
                  Cancelar
                </Button>
              </div>
            </div>
            <div
              className="hidden w-full items-center justify-between md:order-1 md:flex md:w-auto"
              id="mobile-menu-3"
            >
              <ul className="mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
                <li>
                  <p>
                    <b>Factura Nº:</b> {newOrderInfo.invoiceNumber}
                  </p>
                </li>
                {/* <li>
                  <a
                    href="#"
                    className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block border-b border-gray-100 py-2 pr-4 pl-3 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-white"
                  >
                    Services
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </nav>
      )}

      <div className="flex flex-1">
        <main className={cn("flex w-3/5 flex-col")}>{children}</main>
        <DrawersContainer />
      </div>
    </motion.div>
  );
}
