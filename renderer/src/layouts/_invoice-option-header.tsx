import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FcViewDetails } from "react-icons/fc";
import { BiEdit } from "react-icons/bi";
import Button from "@/components/ui/button";
import { formatInvoice } from "../helpers/functions/general";
import { useModalAction } from "@/components/modal-views/context";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder } from "@/store/newOrderSlice";

export const InvoiceOptionsHeader = () => {
  const { openModal } = useModalAction();

  const { newOrderInfo } = useAppSelector(selectNewOrder);

  return (
    <nav className="rounded border-gray-200 bg-gray-200 bg-white py-2.5 px-4 dark:bg-gray-800">
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
              onClick={() => openModal("NEW_ORDER_INVOICE_DETAIL_VIEW")}
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
              className="dark:bg-dark-100 dark:hover:bg-dark-200 pr-5 text-sm text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 md:h-[52px]"
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
          <ul className="mt-4 flex flex-col pl-5 md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium">
            <li>
              <p>
                <b>Factura Nº:</b>{" "}
                {formatInvoice(
                  newOrderInfo.establishmentNumber,
                  newOrderInfo.documentTypeNumber,
                  newOrderInfo.invoicePointNumber,
                  newOrderInfo.invoiceNumber
                )}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};