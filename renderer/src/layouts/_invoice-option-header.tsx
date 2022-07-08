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
    <>
      <Button
        onClick={() => openModal("NEW_ORDER_VIEW")}
        variant="icon"
        aria-label="Layout"
        className="2xl:w- text-center text-base font-medium 2xl:flex"
      >
        <BiEdit size={25} /> Editar Orden
      </Button>
      <Button
        onClick={() => openModal("NEW_ORDER_INVOICE_DETAIL_VIEW")}
        variant="icon"
        aria-label="Layout"
        className="2xl:w- text-center text-base font-medium 2xl:flex"
      >
        <FcViewDetails size={25} /> Detalle Orden
      </Button>
      <Button
        onClick={() => openModal("CANCEL_NEW_ORDER_VIEW")}
        variant="icon"
        aria-label="Layout"
        className="2xl:w- text-center text-base font-medium 2xl:flex"
      >
        <AiFillDelete color="#DA0525" size={25} /> Cancelar Orden
      </Button>
    </>
  );
};
