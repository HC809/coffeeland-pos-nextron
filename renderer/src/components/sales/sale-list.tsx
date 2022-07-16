import {
  formatInvoice,
  formatNumber,
  hourFormat,
} from "@/helpers/functions/general";
import { ISale } from "@/models/ISale";
import { Irender_row, ItableStyle } from "@/models/shared/ITailwindTable";
import { selectGeneralInfo } from "@/store/generalInfoSlice";
import { setSaleToView } from "@/store/salesSlice";
import React from "react";
import Table from "react-tailwind-table";
import { toShortDate } from "../../helpers/functions/general";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useModalAction } from "../modal-views/context";

interface Props {
  sales: ISale[];
}

export const SaleList = ({ sales }: Props) => {
  const { openModal } = useModalAction();
  const dispatch = useAppDispatch();
  const { orderTypes } = useAppSelector(selectGeneralInfo);

  const allSales = [...sales];
  const salesList = allSales
    .sort((a, b) => b.orderInfo.invoiceNumber - a.orderInfo.invoiceNumber)
    .map((sale) => {
      return {
        order: sale.orderInfo.orderNumber,
        orderNumber: sale.orderInfo.orderNumber,
        invoiceNumber: sale.orderInfo.invoiceNumber,
        invoice: formatInvoice(
          sale.orderInfo.establishmentNumber,
          sale.orderInfo.invoicePointNumber,
          sale.orderInfo.documentTypeNumber,
          sale.orderInfo.invoiceNumber
        ),
        customer: sale.orderInfo.customerName,
        date: toShortDate(sale.orderInfo.date!),
        hour: hourFormat(sale.orderInfo.date!),
        orderType: orderTypes.find(
          (c) => c.code === sale.orderInfo.orderTypeCode
        )?.name,
        totalAmount: `L ${formatNumber(sale.orderAmounts.total)}`,
        isSync: sale.orderInfo.isSync,
        isCancelled: sale.orderInfo.cancelled,
      };
    });

  const columns = [
    {
      field: "order",
      use: "N° Orden",
    },
    {
      field: "invoice",
      use: "N° Factura",
    },
    {
      field: "orderType",
      use: "Tipo Orden",
    },
    {
      field: "customer",
      use: "Cliente",
    },
    {
      field: "date",
      use: "Fecha",
    },
    {
      field: "hour",
      use: "Hora",
    },
    {
      field: "totalAmount",
      use: "Total",
    },
    {
      field: "isSync",
      use: "Estado",
    },
    {
      field: "orderNumber",
      use: "Acciones",
    },
  ];

  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "orderNumber") {
      return (
        <button
          onClick={async () => {
            const saleToView =
              sales.find((s) => s.orderInfo.orderNumber === row.orderNumber) ||
              null;
            await dispatch(setSaleToView(saleToView));
            openModal("SALE_DETAIL_VIEW");
          }}
          className="border p-2"
        >
          Ver Detalle
        </button>
      );
    }

    if (column.field === "invoice") {
      return row.isCancelled ? <p className="line-through text-red-500">{display_value}</p> : display_value;
    }

    if (column.field === "order") {
      return <b>{display_value}</b>;
    }

    if (column.field === "isSync") {
      return (
        <b>
          {display_value === true ? (
            <span className="mr-2 rounded bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
              Sincronizada
            </span>
          ) : (
            <span className="mr-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
              Pendiente
            </span>
          )}
        </b>
      );
    }

    return display_value;
  };

  const tableStyle: ItableStyle = {
    base_bg_color: "bg-green-600",
    base_text_color: "bg-green-600",
    table_head: {
      table_data: "bg-green-100 text-center",
    },
  };

  return (
    <Table
      columns={columns}
      rows={salesList}
      should_export={false}
      row_render={rowcheck}
      styling={tableStyle}
      striped={true}
      bordered={true}
      hovered={true}
    />
  );
};
