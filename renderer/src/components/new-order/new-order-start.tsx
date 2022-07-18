import { formatInvoice } from "@/helpers/functions/general";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { selectNewOrder, setNewOrderStartTaxInfo } from "@/store/newOrderSlice";
import { selectTaxInfo } from "@/store/taxInfoSlice";
import React from "react";
import toast from "react-hot-toast";
import Button from "../ui/button";
import { FcPlus } from "react-icons/fc";
import { useModalAction } from "../modal-views/context";

export const NewOrderStartButton = () => {
  const { openModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { printerName } = useAppSelector(selectGeneralInfo);
  const { newOrderInfo } = useAppSelector(selectNewOrder);

  const { invoicePoint, activeInvoiceRange, pendingInvoiceRange } =
    useAppSelector(selectTaxInfo);

  const startNewOrder = async (
    invoiceRangeId: number,
    invoiceNumber: number,
    limitDate: Date,
    cai: string,
    startRangeNumber: number,
    endRangeNumber: number
  ) => {
    await dispatch(
      setNewOrderStartTaxInfo({
        invoicePointId: invoicePoint.id,
        invoiceRangeId: invoiceRangeId,
        establishmentNumber: invoicePoint.establishment,
        documentTypeNumber: invoicePoint.documentType,
        invoicePointNumber: invoicePoint.number,
        invoiceNumber: invoiceNumber,
        limitDate: limitDate,
        cai: cai,
        range: `${formatInvoice(
          invoicePoint.establishment,
          invoicePoint.documentType,
          invoicePoint.number,
          startRangeNumber
        )} / ${formatInvoice(
          newOrderInfo.establishmentNumber,
          newOrderInfo.documentTypeNumber,
          newOrderInfo.invoicePointNumber,
          endRangeNumber
        )}`,
        orderNumber: `${invoicePoint.number}-${invoiceNumber}`,
        orderTypeCode: "COMERAQUI",
      })
    );
  };

  const validateTaxInfo = async () => {
    if (!printerName) {
      return toast.error("No se ha encontrado una impresora conectada.", {
        duration: 1000,
      });
    }

    const {
      cai: activeCai,
      currentNumber: activeCurrentNumber,
      startNumber: activeStartNumber,
      endNumber: activeEndNumber,
      limitDate: activeLimitDate,
    } = activeInvoiceRange;

    const activeNextNumber =
      activeCurrentNumber === 0 ? activeStartNumber : activeCurrentNumber + 1;
    if (activeNextNumber <= activeEndNumber) {
      if (activeLimitDate && activeLimitDate < new Date()) {
        return toast.error(
          `La fecha límite de emisión fue el ${activeLimitDate}.`
        );
      } else {
        startNewOrder(
          activeInvoiceRange.id,
          activeNextNumber,
          activeLimitDate!,
          activeCai,
          activeStartNumber,
          activeEndNumber
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

        const pendingNextNumber =
          pendingCurrentNumber === 0
            ? pendingStartNumber
            : pendingCurrentNumber + 1;
        if (pendingNextNumber <= pendingEndNumber) {
          if (pendingLimitDate && pendingLimitDate < new Date())
            return toast.error(
              `La fecha límite de emisión fue el ${activeLimitDate}.`
            );
          else {
            startNewOrder(
              pendingInvoiceRange.id,
              pendingNextNumber,
              pendingLimitDate!,
              pendingCai,
              pendingStartNumber,
              pendingEndNumber
            );
            openModal("NEW_ORDER_VIEW");
          }
        } else {
          return toast.error(
            "No tiene números de factura disponibles para facturar."
          );
        }
      } else {
        return toast.error(
          "No tiene números de factura disponibles para facturar."
        );
      }
    }
  };

  return (
    <>
      <Button
        onClick={validateTaxInfo}
        variant="icon"
        aria-label="Layout"
        className="2xl:flex 2xl:w-5"
      >
        <FcPlus size={25} /> Iniciar Venta
      </Button>
    </>
  );
};
