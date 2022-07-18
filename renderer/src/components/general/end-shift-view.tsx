import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useModalAction } from "../modal-views/context";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { cancelNewOrder } from "@/store/newOrderSlice";
import { setCloseShift } from "@/store/shiftInfoSlice";
import { removeTaxInfo } from "@/store/taxInfoSlice";
import {
  resetSales,
  selectTotalCard,
  selectTotalCash,
  selectTotalChange,
} from "@/store/salesSlice";
import { logout } from "@/store/authSlice";
import { removeAuthUser } from "@/services/AuthenticationService";
import { selectShiftInfo } from "../../store/shiftInfoSlice";
import { formatNumber } from "@/helpers/functions/general";

export interface IFormValues {
  endCashFlow: number;
}

export default function PrinterConfigView() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { initCashFlow } = useAppSelector(selectShiftInfo);
  const totalCard = useAppSelector(selectTotalCard);
  const totalCash = useAppSelector(selectTotalCash);
  const totalChange = useAppSelector(selectTotalChange);

  const expectedTotalCash =
    Number(initCashFlow) + Number(totalCash) - Number(totalChange);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setLoading(null as any);
    };
  }, []);

  const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
    endCashFlow: yup.number().required("Campo requerido."),
  });

  const initialValues: IFormValues = {
    endCashFlow: 0,
  };

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const onSubmit = async ({ endCashFlow }: IFormValues) => {
    await dispatch(cancelNewOrder());
    await dispatch(setCloseShift());
    await dispatch(removeTaxInfo());
    await dispatch(resetSales());
    await dispatch(logout());
    removeAuthUser();
    closeModal();
  };

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-2 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              Finalizar Turno
            </h1>
          </div>

          <div>
            <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
              <span>Total Tarjeta:</span>
              <span>L {formatNumber(Number(totalCard))}</span>
            </div>
            <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
              <span>Efectivo Inicio:</span>
              <span>L {formatNumber(Number(initCashFlow))}</span>
            </div>
            <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
              <span>Efectivo Ingresado:</span>
              <span>L {formatNumber(Number(totalCash))}</span>
            </div>
            <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
              <span>Efectivo Salida:</span>
              <span>L {formatNumber(Number(totalChange))}</span>
            </div>
            <div className="text-dark text-dark-700 dark:text-light flex justify-between pb-2 text-base font-medium">
              <span>Efectivo Esperado:</span>
              <span>L {formatNumber(Number(expectedTotalCash))}</span>
            </div>
          </div>

          <div className="flex pt-5">
            <div className="py-1">
              <svg
                className="mr-4 h-6 w-6 fill-current text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">
                Para controlar el flujo de efectivo, cuenta el dinero de la caja
                e ingrese el total de efectivo disponible.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <br></br>
              <Input
                label="Efectivo Final en Caja"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("endCashFlow")}
                error={errors.endCashFlow?.message}
              />

              <Button
                type="submit"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
              >
                Finalizar Turno
              </Button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
