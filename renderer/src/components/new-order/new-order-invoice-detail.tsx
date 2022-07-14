import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useModalAction } from "../modal-views/context";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectNewOrder } from "../../store/newOrderSlice";
import { formatInvoice, formatNumber } from "../../helpers/functions/general";

export default function NewOrderInvoiceDetail() {
  const { closeModal } = useModalAction();

  const { newOrderInfo, newOrderAmounts } = useAppSelector(selectNewOrder);

  const {
    total,
    subtotal,
    totalDiscount,
    totalExempt,
    totalExonerated,
    totalTax15,
    totalTax18,
    taxableAmount15,
    taxableAmount18,
    totalTax,
  } = newOrderAmounts;

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              {`Orden # ${newOrderInfo.orderNumber}`}
            </h1>
          </div>
          <div className="border-light-300 dark:border-dark-500 border-t px-5 py-6 sm:px-7 sm:pb-8 sm:pt-7">
            <div className="text-dark">
              <div className="text-dark text-dark-500 dark:text-light flex justify-between pb-4 text-base font-medium">
                <span>Factura N°</span>
                <span>
                  {formatInvoice(
                    newOrderInfo.establishmentNumber,
                    newOrderInfo.invoicePointNumber,
                    newOrderInfo.documentTypeNumber,
                    newOrderInfo.invoiceNumber
                  )}
                </span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Subtotal:</span>
                <span>L {formatNumber(subtotal)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Descuentos y Rebajas:</span>
                <span>L {formatNumber(totalDiscount)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Exento:</span>
                <span>L {formatNumber(totalExempt)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Exonerado:</span>
                <span>L {formatNumber(totalExonerated)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Gravado 15%:</span>
                <span>L {formatNumber(taxableAmount15)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Importe Gravado 18%:</span>
                <span>L {formatNumber(taxableAmount18)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Impuestos del 15%:</span>
                <span>L {formatNumber(totalTax15)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Impuestos del 18%:</span>
                <span>L {formatNumber(totalTax18)}</span>
              </div>
              <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                <span>Total Impuesto:</span>
                <span>L {formatNumber(totalTax)}</span>
              </div>
              <div className="text-dark text-dark-500 dark:text-light flex justify-between pb-1 text-lg  font-medium">
                <span>Total a Pagar:</span>
                <span>L {formatNumber(total)}</span>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={closeModal}
            className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
