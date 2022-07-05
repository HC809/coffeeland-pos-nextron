import * as yup from "yup";
import { useForm } from "react-hook-form";
import Input from "@/components/ui/forms/input";
import Button from "@/components/ui/button";
import { RegisterBgPattern } from "@/components/auth/register-bg-pattern";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  selectNewOrder,
  setNewOrderPaymentInfo,
  selectNewOrderDetailForInvoice,
} from "@/store/newOrderSlice";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";
import {
  formatInvoice,
  formatNumber,
  hourFormat,
  toShortDate,
} from "@/helpers/functions/general";
import { useState, useEffect } from "react";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { NumeroALetras } from "@/helpers/functions/lettersAmount";
// const { ipcRenderer } = window.require('electron');

interface InvoicePrintResponse {
  success: boolean;
  error: string;
  message: string;
}

export interface IFormValues {
  cashAmount: number;
  cardAmount: number;
}

export default function EndNewOrderForm() {
  const { closeModal } = useModalAction();

  const dispatch = useAppDispatch();

  const { newOrderInfo, newOrderAmounts } = useAppSelector(selectNewOrder);
  const newOrderDetailForInvoce = useAppSelector(
    selectNewOrderDetailForInvoice
  );
  const { companyInfo } = useAppSelector(selectGeneralInfo);

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
  });

  const initialValues: IFormValues = {
    cashAmount: 0,
    cardAmount: 0,
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

  const onSubmit = async ({ cashAmount, cardAmount }: IFormValues) => {
    const currentDate = new Date();
    await dispatch(
      setNewOrderPaymentInfo({
        cashAmount,
        cardAmount,
        changeAmount, 
        date: currentDate,
      })
    );
    //await printInvoice(currentDate);
  };

  const printInvoice = async (invoiceDate: Date) => {
    const productDetails = [...newOrderDetailForInvoce];

    const detail = productDetails.map((item) => {
      return {
        quantity: item.quantity,
        price: formatNumber(item.sellingPrice),
        total: formatNumber(item.total),
      };
    });

    const orderModel = {
      invoiceDate: toShortDate(invoiceDate),
      invoiceHour: hourFormat(invoiceDate),
      invoiceNumber: formatInvoice(
        newOrderInfo.establishmentNumber,
        newOrderInfo.documentTypeNumber,
        newOrderInfo.invoicePointNumber,
        newOrderInfo.invoiceNumber
      ),
      limitDate: toShortDate(newOrderInfo.limitDate!),
      range: newOrderInfo.range,
      companyInfo,
      newOrderInfo,
      newOrderAmountList: {
        subtotal: formatNumber(newOrderAmounts.subtotal),
        totalTax15: formatNumber(newOrderAmounts.totalTax15),
        totalTax18: formatNumber(newOrderAmounts.totalTax18),
        totalExempt: formatNumber(newOrderAmounts.totalExempt),
        totalExonerated: formatNumber(newOrderAmounts.totalExonerated),
        totalTax: formatNumber(newOrderAmounts.totalTax),
        taxableAmount15: formatNumber(newOrderAmounts.taxableAmount15),
        taxableAmount18: formatNumber(newOrderAmounts.taxableAmount18),
        total: formatNumber(newOrderAmounts.total),
      },
      lettersAmount: NumeroALetras(newOrderAmounts.total),
      newOrderProductDetail: detail,
    };

    console.log(orderModel);

    // const invoicePrintResponse: InvoicePrintResponse = await ipcRenderer.invoke(
    //   'print-invoice',
    //   {
    //     invoiceDate: toShortDate(invoiceDate),
    //     invoiceHour: hourFormat(invoiceDate),
    //     invoiceNumber: `${formatLeadingZeros(0, 3)}-${formatLeadingZeros(
    //       1,
    //       3
    //     )}-${formatLeadingZeros(1, 3)}-${formatLeadingZeros(
    //       newOrderInfo?.invoiceNumber,
    //       8
    //     )}`,
    //     companyInfo,
    //     newOrderInfo,
    //     newOrderAmountList: {
    //       subtotal: formatNumber(newOrderAmounts.subtotal),
    //       totalTax15: formatNumber(newOrderAmounts.totalTax15),
    //       totalTax18: formatNumber(newOrderAmounts.totalTax18),
    //       totalExempt: formatNumber(newOrderAmounts.totalExempt),
    //       totalExonerated: formatNumber(newOrderAmounts.totalExonerated),
    //       totalTax: formatNumber(newOrderAmounts.totalTax),
    //       taxableAmount15: formatNumber(newOrderAmounts.taxableAmount15),
    //       taxableAmount18: formatNumber(newOrderAmounts.taxableAmount18),
    //       total: formatNumber(newOrderAmounts.total),
    //     },
    //     lettersAmount: NumeroALetras(newOrderAmounts.total),
    //     newOrderProductDetail: newOrderDetailForInvoce,
    //   }
    // );

    // if (invoicePrintResponse.success) {
    //   //alert(1);
    // } else {
    //   toast.error(invoicePrintResponse.error, {
    //     position: 'bottom-center',
    //     duration: 5000,
    //   });
    // }
  };

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
              <Input
                label="Efectivo"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("cashAmount")}
                onChange={(e) => sumCashAmounts(Number(e.target.value))}
                error={errors.cashAmount?.message}
              />
              {changeAmount > 0 && <p>{`Cambio: L ${changeAmount}`}</p>}

              <br></br>

              <Input
                label="Tarjeta"
                inputClassName="bg-light dark:bg-dark-300"
                {...register("cardAmount")}
                onChange={(e) => sumCardAmounts(Number(e.target.value))}
                error={errors.cardAmount?.message}
              />

              <Button
                type="submit"
                className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                disabled={newOrderAmounts.total > totalAmount}
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
