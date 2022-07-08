import { formatInvoice } from "@/helpers/functions/general";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { selectNewOrder, setNewOrderStartTaxInfo } from "@/store/newOrderSlice";
import { selectTaxInfo } from "@/store/taxInfoSlice";
import React from "react";
import toast from "react-hot-toast";
import Button from "../ui/button";
import { FcPlus } from "react-icons/fc";
import { OrderType } from "@/data/OrderTypes";
import { useRouter } from "next/router";
import routes from "@/config/routes";

export const NewOrderStartButton = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { printerName } = useAppSelector(selectGeneralInfo);
  const { newOrderInfo } = useAppSelector(selectNewOrder);

  const { invoicePoint, activeInvoiceRange, pendingInvoiceRange } =
    useAppSelector(selectTaxInfo);

  const validateTaxInfo = async () => {
    if (!printerName) {
      return toast.error("No se ha encontrado una impresora conectada.");
    }

    const {
      cai: activeCai,
      currentNumber: activeCurrentNumber,
      startNumber: activeStartNumber,
      endNumber: activeEndNumber,
      limitDate: activeLimitDate,
    } = activeInvoiceRange;

    const activeNextNumber = activeCurrentNumber + 1;
    if (activeNextNumber < activeEndNumber) {
      if (activeLimitDate && activeLimitDate < new Date()) {
        return toast.error(
          `La fecha límite de emisión fue el ${activeLimitDate}.`
        );
      } else {
        await  dispatch(
          setNewOrderStartTaxInfo({
            invoicePointId: invoicePoint.id,
            invoiceRangeId: activeInvoiceRange.id,
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
            orderNumber: `${invoicePoint.number}-${activeNextNumber}`,
            orderType: OrderType.SUC,
          })
        );
        return router.push(routes.home);
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
            return toast.error(
              `La fecha límite de emisión fue el ${activeLimitDate}.`
            );
          else {
            await dispatch(
              setNewOrderStartTaxInfo({
                invoicePointId: invoicePoint.id,
                invoiceRangeId: pendingInvoiceRange.id,
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
                orderNumber: `${invoicePoint.number}-${pendingNextNumber}`,
                orderType: OrderType.SUC,
              })
            );
            return router.push(routes.home);
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
