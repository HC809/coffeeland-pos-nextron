import { formatInvoice } from "@/helpers/functions/general";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder, setNewOrderTaxInfo } from "@/store/newOrderSlice";
import { selectTaxInfo } from "@/store/taxInfoSlice";
import React from "react";
import toast from "react-hot-toast";
import { useModalAction } from "../modal-views/context";
import Button from "../ui/button";

export const NewOrderStartButton = () => {
  const { openModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { newOrderInfo } = useAppSelector(selectNewOrder);

  const { invoicePoint, activeInvoiceRange, pendingInvoiceRange } =
    useAppSelector(selectTaxInfo);

  const validateTaxInfo = async () => {
    const {
      cai: activeCai,
      currentNumber: activeCurrentNumber,
      startNumber: activeStartNumber,
      endNumber: activeEndNumber,
      limitDate: activeLimitDate,
    } = activeInvoiceRange;

    const activeNextNumber = activeCurrentNumber + 1;
    if (activeNextNumber + 1 < activeEndNumber) {
      if (activeLimitDate && activeLimitDate < new Date()) {
        toast.error(`La fecha límite de emisión fue el ${activeLimitDate}.`);
      } else {
        dispatch(
          setNewOrderTaxInfo({
            establishmentNumber: invoicePoint.establishment,
            documentTypeNumber: invoicePoint.documentType,
            invoicePointNumber: invoicePoint.number,
            invoiceNumber: activeNextNumber,
            limitDate: activeLimitDate!,
            cai: activeCai,
            range: `${formatInvoice(
              invoicePoint.establishment,
              invoicePoint.documentType,
              invoicePoint.number,
              activeStartNumber
            )} / ${formatInvoice(
              newOrderInfo.establishmentNumber,
              newOrderInfo.documentTypeNumber,
              newOrderInfo.invoicePointNumber,
              activeEndNumber
            )}`,
          })
        );
        openModal("NEW_ORDER_VIEW");
      }
    } else {
      if (pendingInvoiceRange) {
        const {
          currentNumber: pendingCurrentNumber,
          startNumber: pendingStartNumber,
          endNumber: pendingEndNumber,
          limitDate: pendingLimitDate,
          cai: pendingCai,
        } = pendingInvoiceRange;

        const pendingNextNumber = pendingCurrentNumber + 1;
        if (pendingNextNumber < pendingEndNumber) {
          if (pendingLimitDate && pendingLimitDate < new Date())
            toast.error(
              `La fecha límite de emisión fue el ${activeLimitDate}.`
            );
          else {
            dispatch(
              setNewOrderTaxInfo({
                establishmentNumber: invoicePoint.establishment,
                documentTypeNumber: invoicePoint.documentType,
                invoicePointNumber: invoicePoint.number,
                invoiceNumber: pendingNextNumber,
                limitDate: pendingLimitDate!,
                cai: pendingCai,
                range: `${formatInvoice(
                  invoicePoint.establishment,
                  invoicePoint.documentType,
                  invoicePoint.number,
                  pendingStartNumber
                )} / ${formatInvoice(
                  newOrderInfo.establishmentNumber,
                  newOrderInfo.documentTypeNumber,
                  newOrderInfo.invoicePointNumber,
                  pendingEndNumber
                )}`,
              })
            );
            openModal("NEW_ORDER_VIEW");
          }
        } else {
          toast.error("No tiene números de factura disponibles para facturar.");
        }
      } else {
        toast.error("No tiene números de factura disponibles para facturar.");
      }
    }
  };

  return (
    <>
      <Button onClick={validateTaxInfo} className="w-full text-sm md:h-[52px]">
        Nueva Venta
      </Button>
    </>
  );
};
