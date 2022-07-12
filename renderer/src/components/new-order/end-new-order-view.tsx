import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  selectNewOrder,
  selectNewOrderDetailForInvoice,
} from "@/store/newOrderSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import { formatNumber } from "@/helpers/functions/general";
import { useState, useEffect } from "react";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import toast from "react-hot-toast";
import { addSale } from "@/store/salesSlice";
import { ISale } from "@/models/ISale";
import { incrementCurrentNumberRange } from "@/store/taxInfoSlice";
import { cancelNewOrder } from "@/store/newOrderSlice";
import routes from "@/config/routes";
import { useRouter } from "next/router";
import { printInvoice } from "@/services/PrintService";
import { duration } from "moment";

export interface IFormValues {
  cashAmount: number;
  cardAmount: number;
  reference?: string;
}

export default function EndNewOrderForm() {
  const router = useRouter();
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { newOrderInfo, newOrderAmounts, newOrderDetail } =
    useAppSelector(selectNewOrder);
  const newOrderDetailForInvoce = useAppSelector(
    selectNewOrderDetailForInvoice
  );
  const { companyInfo, printerName } = useAppSelector(selectGeneralInfo);

  const [loading, setLoadig] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  useEffect(() => {
    return () => {
      setLoadig(null as any);
      setTotalAmount(null as any);
      setChangeAmount(null as any);
    };
  }, []);

  const validationSchema: yup.SchemaOf<IFormValues> = yup.object().shape({
    cashAmount: yup
      .number()
      .transform((curr, orig) => (orig === "" ? 0 : curr))
      .min(0, "El monto no puede ser menor a 0.")
      .required(),
    cardAmount: yup
      .number()
      .transform((curr, orig) => (orig === "" ? 0 : curr))
      .min(0, "El monto no puede ser menor a 0.")
      .max(newOrderAmounts.total, "No puede pagar más del monto total.")
      .required(),
    reference: yup.string().when("cardAmount", {
      is: (cardAmount: number) => cardAmount > 0,
      then: yup.string().required("El número de referencia es requerido."),
    }),
  });

  const initialValues: IFormValues = {
    cashAmount: 0,
    cardAmount: 0,
    reference: "",
  };

  const {
    handleSubmit,
    register,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });

  const sumCashAmounts = (cashAmount: number) => {
    const cardAmount = getValues("cardAmount");
    const total = Number(cashAmount) + Number(cardAmount);

    if (total > newOrderAmounts.total) {
      if (cardAmount > newOrderAmounts.total) {
        setTotalAmount(total);
        setChangeAmount(0);
      } else {
        const difference = Number(total) - Number(newOrderAmounts.total);
        setTotalAmount(total);
        setChangeAmount(difference);
      }
    } else {
      setTotalAmount(total);
      setChangeAmount(0);
    }
  };

  const sumCardAmounts = (cardAmount: number) => {
    const cashAmount = getValues("cashAmount");
    const total = Number(cashAmount) + Number(cardAmount);

    if (total > newOrderAmounts.total) {
      if (cardAmount > newOrderAmounts.total) {
        setTotalAmount(total);
        setChangeAmount(0);
      } else {
        const difference = Number(total) - Number(newOrderAmounts.total);
        setTotalAmount(total);
        setChangeAmount(difference);
      }
    } else {
      setTotalAmount(total);
      setChangeAmount(0);
    }
  };

  const onSubmit = async ({
    cashAmount,
    cardAmount,
    reference,
  }: IFormValues) => {
    console.log(totalAmount);
    console.log(newOrderAmounts.total);

    if (totalAmount < newOrderAmounts.total) {
      return toast.error("El monto a pagar debe ser mayor al total.", {
        duration: 2000,
      });
    } else {
      setLoadig(true);
      const currentDate = new Date();
      const completeInvoice: ISale = {
        orderInfo: {
          ...newOrderInfo,
          cashAmount,
          cardAmount,
          changeAmount,
          reference: reference || "",
          date: currentDate,
        },
        orderAmounts: { ...newOrderAmounts },
        orderDetail: { ...newOrderDetail },
      };

      // await printInvoice(
      //   printerName,
      //   newOrderInfo,
      //   newOrderAmounts,
      //   [...newOrderDetailForInvoce],
      //   companyInfo,
      //   currentDate,
      //   Number(getValues("cardAmount")),
      //   Number(getValues("cashAmount")),
      //   Number(getValues("reference")),
      //   false
      // );

      setLoadig(false);

      await dispatch(addSale(completeInvoice));
      await dispatch(incrementCurrentNumberRange(newOrderInfo.invoiceRangeId));
      await dispatch(cancelNewOrder());

      router.push(routes.home);
      closeModal();
    }
  };

  useEffect(() => {
    setFocus("cashAmount");
  }, [setFocus]);

  return (
    <div className="px-6 pt-5 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="text-light dark:text-dark-300 absolute bottom-0 left-0 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="pb-2 text-center ">
            <h1 className="text-dark dark:text-light text-lg font-medium tracking-[-0.3px] lg:text-xl">
              {`Total: L ${formatNumber(newOrderAmounts.total)}`}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <>
              <div className="grid h-full grid-cols-8">
                <img
                  className="col-span-2 pt-5"
                  src="/images/money.png"
                  width={50}
                />
                <div className="col-span-6">
                  <Input
                    label="Efectivo"
                    inputClassName="bg-light dark:bg-dark-300"
                    {...register("cashAmount")}
                    onChange={(e) => sumCashAmounts(Number(e.target.value))}
                    error={errors.cashAmount?.message}
                    className={"pb-1"}
                  />
                  {changeAmount > 0 && <p>{`Cambio: L ${changeAmount}`}</p>}
                </div>
              </div>

              <br></br>

              <div className="grid h-full grid-cols-8">
                <img
                  className="col-span-2 pt-5"
                  src="/images/credit-card.png"
                  width={50}
                />
                <Input
                  label="Tarjeta"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register("cardAmount")}
                  onChange={(e) => sumCardAmounts(Number(e.target.value))}
                  error={errors.cardAmount?.message}
                  className="col-span-6"
                />
              </div>

              <div className="grid h-full grid-cols-8">
                <div className="col-span-2 pt-5"></div>
                <Input
                  label="Referencia"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register("reference")}
                  error={errors.reference?.message}
                  className="col-span-6"
                />
              </div>

              <Button
                type="submit"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                isLoading={loading}
                disabled={newOrderAmounts.total > totalAmount || loading}
              >
                {!loading ? "Facturar" : "Imprimiendo Factura..."}
              </Button>
            </>
          </form>
        </div>
      </div>
    </div>
  );
}
