import {
  formatInvoice,
  formatNumber,
  hourFormat,
} from "@/helpers/functions/general";
import { ISale } from "@/models/ISale";
import { Irender_row, ItableStyle } from "@/models/shared/ITailwindTable";
import React from "react";
import Table from "react-tailwind-table";
import { toShortDate } from "../../helpers/functions/general";

interface Props {
  sales: ISale[];
}

export const SaleList = ({ sales }: Props) => {
  const allSales = [...sales];
  const salesList = allSales
    .sort((a, b) => b.orderInfo.invoiceNumber - a.orderInfo.invoiceNumber)
    .map((sale) => {
      return {
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
        orderType: sale.orderInfo.orderType,
        totalAmount: `L ${formatNumber(sale.orderAmounts.total)}`,
      };
    });

  const columns = [
    {
      field: "orderNumber",
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
      field: "invoiceNumber",
      use: "Acciones",
    },
  ];

  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "invoiceNumber") {
      return (
        <button onClick={() => alert(row.invoiceNumber)} className="border p-2">
          Ver Detalle
        </button>
      );
    }

    if (column.field === "orderNumber") {
      return <b>{display_value}</b>;
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
