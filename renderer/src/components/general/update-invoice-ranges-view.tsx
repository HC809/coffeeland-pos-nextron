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
import { selectTaxInfo } from "../../store/taxInfoSlice";
import {
  setActiveInvoiceRange,
  setPendingInvoiceRange,
} from "@/store/taxInfoSlice";

export default function UpdateProductsView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { invoicePoint } = useAppSelector(selectTaxInfo);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setLoading(null as any);
    };
  }, []);

  const updateData = async () => {
    setLoading(true);
    try {
      const { data, success, errorMessage } =
        await ApiService.updateInvoiceRanges(invoicePoint.id);

      if (success) {
        const { invoiceRangeInUse, invoiceRangePending } = data;
        if (invoiceRangeInUse)
          await dispatch(setActiveInvoiceRange(invoiceRangeInUse));
        await dispatch(setPendingInvoiceRange(invoiceRangePending));
        closeModal();
        return toast.success(<b>Información actualizada correctamente!</b>, {
          duration: 1000,
        });
      } else {
        return toast.error(<b>{errorMessage}</b>, { duration: 4000 });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error as AxiosError);
      toast.error(`Error al actualizar los productos: ${errorMessage}.`);
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
              Actualizar Rangos de Facturación
            </h1>
            <p> ¿Estás seguro de que actualizar los rangos de facturación?</p>
          </div>
          <>
            <Button
              type="button"
              isLoading={loading}
              disabled={loading}
              onClick={updateData}
              className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
            >
              Actualizar
            </Button>
          </>
        </div>
      </div>
    </div>
  );
}
