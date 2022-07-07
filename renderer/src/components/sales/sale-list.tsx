import {
  formatInvoice,
  formatNumber,
  hourFormat,
} from "@/helpers/functions/general";
import { ISale } from "@/models/ISale";
import { Irender_row, ItableStyle } from "@/models/shared/ITailwindTable";
import React from "react";
import Table from "react-tailwind-table";

interface Props {
  sales: ISale[];
}

export const SaleList = ({ sales }: Props) => {
  const salesList = sales.map((sale) => {
    return {
      invoiceNumber: formatInvoice(
        sale.orderInfo.establishmentNumber,
        sale.orderInfo.invoicePointNumber,
        sale.orderInfo.documentTypeNumber,
        sale.orderInfo.invoiceNumber
      ),
      hour: hourFormat(sale.orderInfo.date!),
      orderType: sale.orderInfo.orderType,
      totalAmount: `L ${formatNumber(sale.orderAmounts.total)}`,
    };
  });

  const columns = [
    {
      field: "invoiceNumber",
      use: "# Factura",
    },
    {
      field: "orderType",
      use: "Tipo Orden",
    },
    {
      field: "hour",
      use: "Hora",
    },
    {
      field: "totalAmount",
      use: "Total",
    },
  ];

  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "totalAmount") {
      return (
        <button onClick={() => alert(row.invoiceNumber)} className="border p-2">
          Ver Detalle
        </button>
      );
    }

    if (column.field === "invoiceNumber") {
      return <b>{display_value}</b>;
    }

    return display_value;
  };

  const tableStyle: ItableStyle = {
    base_bg_color: "bg-green-600",
    base_text_color: "bg-green-600",
    //main: "bg-green-600",
    top: {
      elements: {
        search: "Buscar..",
      },
    },
  };

  return (
    <Table
      columns={columns}
      rows={salesList}
      should_export={false}
      row_render={rowcheck}
      styling={tableStyle}
    />
  );
};
