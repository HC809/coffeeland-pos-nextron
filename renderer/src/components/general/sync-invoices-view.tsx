import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import { ApiService } from "@/api/principalService";
import { useEffect, useState } from "react";
import { getAxiosErrorMessage } from "@/helpers/manageAxiosError";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { selectPendingSales, updateSyncInvoices } from "../../store/salesSlice";
import { getInvoicesModel } from "@/services/InvoiceService";
import { selectAuth } from "../../store/authSlice";

export default function UpdateProductsView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  const { username } = useAppSelector(selectAuth);
  const pendingSales = useAppSelector(selectPendingSales);

  useEffect(() => {
    return () => {
      setLoading(null as any);
    };
  }, []);

  const saveInvoices = async () => {
    setLoading(true);
    try {
      const invoices = getInvoicesModel(pendingSales, username || "");

      const { data, success, errorMessage } = await ApiService.saveInvoices(
        invoices
      );

      if (success) {
        await dispatch(updateSyncInvoices(data));
        closeModal();
        return toast.success(<b>Facturas sincronizadas exitosamente!</b>, {
          duration: 1000,
        });
      } else {
        return toast.error(<b>{errorMessage}</b>, { duration: 4000 });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error as AxiosError);
      console.log(errorMessage);
      toast.error(`Error: ${errorMessage}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Sincronizar Facturas
            </h1>
            <p>
              {pendingSales.length > 0
                ? `${pendingSales.length} factura(s) pendiente(s) de sincronizar.`
                : "No hay facturas pendientes de sincronizar."}
            </p>
          </div>
          <>
            <Button
              type="button"
              isLoading={loading}
              disabled={loading || pendingSales.length === 0}
              onClick={saveInvoices}
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
            >
              Sincronizar
            </Button>
          </>
        </div>
      </div>
    </div>
  );
}
