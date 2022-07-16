import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useModalAction } from "../modal-views/context";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { cancelSale, selectSaleToCancel } from "@/store/salesSlice";
import SaleDetailTabs from "./sale-detail-tabs";
import { formatInvoice } from "@/helpers/functions/general";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Textarea from "../ui/forms/textarea";

export interface IFormValues {
  cancelledReason: string;
}

export default function CancelSaleView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const sale = useAppSelector(selectSaleToCancel);

  const { orderInfo } = sale || {};

  const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
    cancelledReason: yup.string().required("Campo requerido."),
  });

  const initialValues: IFormValues = {
    cancelledReason: "",
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({ cancelledReason }: IFormValues) => {
    await dispatch(
      cancelSale({
        uuid: sale?.uuid || "",
        reason: cancelledReason,
      })
    );
    closeModal();
    return toast.success("Factura anulada correctamente!.", { duration: 500 });
  };

  return (
    <div className="px-6 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[400px]">
          <div className="pb-5 text-center">
            <h1 className="text-dark dark:text-light pb-5 text-lg font-medium tracking-[-0.3px] lg:text-xl">
              {`Anular Factura ${formatInvoice(
                orderInfo?.establishmentNumber || 0,
                orderInfo?.invoicePointNumber || 0,
                orderInfo?.documentTypeNumber || 0,
                orderInfo?.invoiceNumber || 0
              )}`}
            </h1>
            <p> ¿Estás seguro de anular esta factura?</p>
          </div>

          <SaleDetailTabs sale={sale!} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <br></br>
              <Textarea
                label="Razón de anulación"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("cancelledReason")}
                error={errors.cancelledReason?.message}
              />
              {!orderInfo?.cancelled && (
                <>
                  <Button
                    type="submit"
                    className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                    variant="solidDanger"
                  >
                    Anular Factura
                  </Button>
                </>
              )}
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
