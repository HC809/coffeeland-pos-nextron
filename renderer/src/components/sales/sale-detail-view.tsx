import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useModalAction } from "../modal-views/context";
import { useAppSelector } from "@/hooks/reduxHooks";
import {
  selectSaleToView,
  setSaleToCancel,
  setSaleToView,
} from "@/store/salesSlice";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { printSale } from "@/services/PrintService";
import { useEffect, useState } from "react";
import SaleDetailTabs from "./sale-detail-tabs";
import { useDispatch } from "react-redux";

export default function SaleDetail() {
  const { closeModal, openModal } = useModalAction();

  const dispatch = useDispatch();

  const sale = useAppSelector(selectSaleToView);
  const { companyInfo, printerName } = useAppSelector(selectGeneralInfo);

  const { orderInfo } = sale || {};

  const [loadingOriginal, setLoadingOriginal] = useState<boolean>(false);
  const [loadingCopy, setLoadingCopy] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      dispatch(setSaleToView(null));
      setLoadingOriginal(null as any);
      setLoadingCopy(null as any);
    };
  }, []);

  return (
    <div className="px-6 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[400px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              {`Orden # ${orderInfo?.orderNumber}`}
            </h1>
            {orderInfo?.cancelled && (
              <div>
                <p className="text-red-900 text-lg">Factura Anulada</p>
                <p className="text-red-700">{`Razón: ${orderInfo?.cancelledReason}`}</p>
              </div>
            )}
          </div>

          <SaleDetailTabs sale={sale!} />

          <h4 className="pt-5 text-center">Imprimir Facturas</h4>
          <div className="grid h-full grid-cols-3 gap-5">
            <Button
              type="button"
              onClick={async () => {
                setLoadingOriginal(true);
                await printSale(printerName, sale!, companyInfo, false);
                setLoadingOriginal(false);
              }}
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              disabled={loadingOriginal}
              isLoading={loadingOriginal}
            >
              Original
            </Button>
            <Button
              type="button"
              onClick={async () => {
                setLoadingCopy(true);
                await printSale(printerName, sale!, companyInfo, true);
                setLoadingCopy(false);
              }}
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              disabled={loadingCopy}
              isLoading={loadingCopy}
            >
              Copia
            </Button>
            <Button
              type="button"
              onClick={closeModal}
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              // disabled={loading}
              // isLoading={loading}
            >
              Ticket Cocina
            </Button>
          </div>

          {!orderInfo?.cancelled && (
            <>
              <Button
                type="button"
                onClick={async () => {
                  await dispatch(setSaleToCancel(sale!));
                  closeModal();
                  openModal("CANCEL_SALE_VIEW");
                }}
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                variant="solidDanger"
              >
                Anular Factura
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
