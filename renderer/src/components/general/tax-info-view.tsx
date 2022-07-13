import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import { ApiService } from "@/api/principalService";
import { useEffect, useState } from "react";
import { setCategories } from "@/store/categoriesSlice";
import { setProducts } from "@/store/productsSlice";
import { getAxiosErrorMessage } from "@/helpers/manageAxiosError";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { selectTaxInfo } from "@/store/taxInfoSlice";
import { formatLeadingZeros } from "@/helpers/functions/general";

export default function TaxInfoView() {
  const { closeModal } = useModalAction();

  const { invoicePoint, activeInvoiceRange, pendingInvoiceRange } =
    useAppSelector(selectTaxInfo);

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Información Fiscal
            </h1>
            <div className="border-light-300 dark:border-dark-500 border-t px-5 py-6 sm:px-7 sm:pb-8 sm:pt-7">
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Establecimiento</span>
                  <span>
                    {formatLeadingZeros(invoicePoint.establishment, 3)}
                  </span>
                </div>
              </div>
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Punto de Emisión</span>
                  <span>{formatLeadingZeros(invoicePoint.number, 3)}</span>
                </div>
              </div>
            </div>

            <div className="border-light-300 dark:border-dark-500 border-t px-5 py-6 sm:px-7 sm:pb-8 sm:pt-7">
              <div className="text-dark">
                <div className="text-dark text-dark-500 dark:text-light flex justify-between pb-4 text-base font-medium">
                  <span>Rango de Facturacion (Activo)</span>
                </div>
              </div>
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Número Inicio</span>
                  <span>{activeInvoiceRange.startNumber}</span>
                </div>
              </div>
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Número Final</span>
                  <span>{activeInvoiceRange.endNumber}</span>
                </div>
              </div>
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Número Actual</span>
                  <span>{activeInvoiceRange.currentNumber}</span>
                </div>
              </div>
              <div className="text-dark">
                <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                  <span>Números Disponibles</span>
                  <span>
                    {activeInvoiceRange.currentNumber === 0
                      ? activeInvoiceRange.endNumber -
                        (activeInvoiceRange.startNumber - 1)
                      : activeInvoiceRange.endNumber -
                        activeInvoiceRange.currentNumber}
                  </span>
                </div>
              </div>
            </div>

            {pendingInvoiceRange && (
              <div className="border-light-300 dark:border-dark-500 border-t px-5 py-6 sm:px-7 sm:pb-8 sm:pt-7">
                <div className="text-dark">
                  <div className="text-dark text-dark-500 dark:text-light flex justify-between pb-4 text-base font-medium">
                    <span>Rango de Facturacion (Respaldo)</span>
                  </div>
                </div>
                <div className="text-dark">
                  <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                    <span>Número Inicio</span>
                    <span>{pendingInvoiceRange.startNumber}</span>
                  </div>
                </div>
                <div className="text-dark">
                  <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                    <span>Número Final</span>
                    <span>{pendingInvoiceRange.endNumber}</span>
                  </div>
                </div>
                <div className="text-dark">
                  <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                    <span>Número Actual</span>
                    <span>{pendingInvoiceRange.currentNumber}</span>
                  </div>
                </div>
                <div className="text-dark">
                  <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
                    <span>Números Disponibles</span>
                    <span>
                      {pendingInvoiceRange.currentNumber === 0
                        ? pendingInvoiceRange.endNumber -
                          (pendingInvoiceRange.startNumber - 1)
                        : pendingInvoiceRange.endNumber -
                          pendingInvoiceRange.currentNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
