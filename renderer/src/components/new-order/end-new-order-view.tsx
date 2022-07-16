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
  selectNewOrderDetailForTocket,
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
import { printInvoice, printTicket } from "@/services/PrintService";
import { v4 as uuidv4 } from "uuid";
import { selectShiftInfo } from "@/store/shiftInfoSlice";

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
  const { uuid } = useAppSelector(selectShiftInfo);

  const totalToPay = newOrderAmounts.total;

  const newOrderDetailForInvoce = useAppSelector(
    selectNewOrderDetailForInvoice
  );
  const newOrderDetailForTicket = useAppSelector(selectNewOrderDetailForTocket);
  const { companyInfo, printerName, orderTypes } =
    useAppSelector(selectGeneralInfo);

  const [loading, setLoadig] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);
  const [printKitchenTicket, setPrintKitchenTicket] = useState<boolean>(true);

  useEffect(() => {
    setPrintKitchenTicket(true);
    return () => {
      setLoadig(null as any);
      setTotalAmount(null as any);
      setChangeAmount(null as any);
      setPrintKitchenTicket(null as any);
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
      .max(totalToPay, "No puede pagar más del monto total.")
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

    if (total > totalToPay) {
      if (cardAmount > totalToPay) {
        setTotalAmount(total);
        setChangeAmount(0);
      } else {
        const difference = Number(total) - Number(totalToPay);
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

    if (total > totalToPay) {
      if (cardAmount > totalToPay) {
        setTotalAmount(total);
        setChangeAmount(0);
      } else {
        const difference = Number(total) - Number(totalToPay);
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
    if (totalAmount < totalToPay) {
      return toast.error("El monto a pagar debe ser mayor al total.", {
        duration: 2000,
      });
    }

    if (cardAmount > totalToPay) {
      return toast.error(
        "El monto a pagar en tarjeta no puede ser mayor al total.",
        {
          duration: 2000,
        }
      );
    }

    setLoadig(true);
    const currentDate = new Date();
    const completeInvoice: ISale = {
      uuid: uuidv4(),
      shiftUuid: uuid,
      orderInfo: {
        ...newOrderInfo,
        cashAmount: cashAmount,
        cardAmount: cardAmount,
        changeAmount: changeAmount,
        reference: reference || "",
        date: currentDate,
      },
      orderAmounts: { ...newOrderAmounts },
      orderDetail: [...newOrderDetail],
    };
    await printInvoice(
      printerName,
      newOrderInfo,
      newOrderAmounts,
      [...newOrderDetailForInvoce],
      companyInfo,
      currentDate,
      Number(getValues("cashAmount")),
      Number(getValues("cardAmount")),
      changeAmount,
      false
    );
    await printInvoice(
      printerName,
      newOrderInfo,
      newOrderAmounts,
      [...newOrderDetailForInvoce],
      companyInfo,
      currentDate,
      Number(getValues("cashAmount")),
      Number(getValues("cardAmount")),
      changeAmount,
      true
    );
    if (printKitchenTicket) {
      await printTicket(
        printerName,
        newOrderInfo.orderNumber,
        newOrderInfo.ticketNumber,
        currentDate,
        orderTypes.find((ot) => ot.code === newOrderInfo.orderTypeCode)?.name ||
          "",
        [...newOrderDetailForTicket]
      );
    }
    setLoadig(false);
    await dispatch(addSale(completeInvoice));
    await dispatch(incrementCurrentNumberRange(newOrderInfo.invoiceRangeId));
    await dispatch(cancelNewOrder());
    closeModal();
    router.push(routes.home);
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
              {`Total: L ${formatNumber(totalToPay)}`}
            </h1>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <div>
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

              <div className="pt-10 text-center">
                <label className="relative mr-5 inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    value={"printKitchenTicket"}
                    onChange={() => setPrintKitchenTicket((val) => !val)}
                    id="green-toggle"
                    className="peer sr-only"
                    checked={printKitchenTicket}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-0.5 after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-green-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-green-800"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    Imprimir Ticket de Cocina
                  </span>
                </label>
              </div>

              <Button
                type="button"
                onClick={() => onSubmit(getValues())}
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                isLoading={loading}
                disabled={totalToPay > totalAmount || loading}
              >
                {!loading ? "Facturar" : "Imprimiendo Factura..."}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
